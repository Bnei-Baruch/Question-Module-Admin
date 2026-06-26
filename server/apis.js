const express = require('express');
const router = express.Router();
const db = require('./db');
const cfg = require('./cfg.js');
const fs = require('fs');
const socketUtils = require('./socketUtils');
const { Translate } = require('@google-cloud/translate').v2;
const googleTranslate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

/**
    Expected payload:

    askForMe: Boolean, // redandance - default false
    question: {
        content: String
    },
    user: {
        name: String,
        gender: String (‘male’/’female’)
        galaxyRoom: String
    }
 */

router.post('/feed', async (request, response) => {
    try {
        const { serialUserId } = request.body;
        if (!serialUserId) throw { data: { msg: 'no serial user id' } };

        const fromTime = new Date().getTime() - (1000*60*60*4);

        // feed
        const feed = await db.get({
            collection: 'questions', 
            query: {
                timestamp: {$gt: fromTime},
                'user.serialUserId': {$ne: String(serialUserId)},
                discard: false,
                approvedForBroadcast: true
            }
        });

        const myFeed = await db.get({
            collection: 'questions', 
            query: {
                timestamp: {$gt: fromTime},
                'user.serialUserId': String(serialUserId)
            }
        });

        let _feed = feed.concat(myFeed).sort((a,b) => a.timestamp > b.timestamp ? -1 : 1);

        response.json({feed: _feed});
    } catch (err) {
        response.status(err.status || 400).json(err.data || { data: { msg: 'feed error', err } });
    }
});

router.post('/ask', async (request, response) => {
    try {
        let { body } = request;
        // validation:
        if (!body.serialUserId) throw { data: { msg: 'no serial user id' } };
        if (!body.question) throw { data: { msg: 'question obj was not found' } };
        if (!body.question.content) throw { data: { msg: 'question content was not found' } };
        if (!body.user) throw { data: { msg: 'user was not found' } };
        if (!body.user.name) throw { data: { msg: 'user name was not found' } };
        if (!body.user.gender) throw { data: { msg: 'user gender was not found' } };
        if (!['male', 'female'].includes(body.user.gender)) throw { data: { msg: 'wrong user gender enum should be "male" or "female"' } };
        if (!body.user.galaxyRoom) throw { data: { msg: 'user galaxy room was not found' } };

        if (body.askForMe == undefined) body.askForMe = true;

        const serialUserId = body.serialUserId;
        delete body.serialUserId;
        body.user.serialUserId = serialUserId

        const [translatedText] = await googleTranslate.translate(body.question.content, 'he');
        console.log(translatedText);
        body.question.translation = { he: translatedText };

        const newQuestion = await db.create({
            collection: 'questions', data: {
                ...body,
                timestamp: new Date().getTime()
            }
        });

        socketUtils.push('newQuestion', newQuestion._doc, serialUserId);
        response.json(newQuestion._doc);



    } catch (err) {
        response.status(err.status || 400).json(err.data || { data: { msg: 'enter user error', err } });
    }
});

router.post('/getQuestions', async (request, response) => {
    try {
        const questions = await db.get({
            collection: 'questions',
            query: {
                clear: false,
                hasBeenAsked: false,
                discard: false
            }
        });

        response.json(questions);

    } catch (err) {
        response.status(err.status || 400).json(err.data || { data: { msg: 'get questions error', err } });
    }
});

router.post('/questionAction', async (request, response) => {
    try {
        const { action, questionId, serialUserId, index, source, target } = request.body;
        let data = {};

        switch (action) {
            case 'markQuestionAsRead':
                data = { $set: { hasBeenRead: true } };
                break;
            case 'discardQuestion':
                data = { $set: { discard: true } };
                break;
            case 'approvedForBroadcast':
                data = { $set: { approvedForBroadcast: true, broadcastOrderingIndex: index } };
                break;
            case 'disapprovedForBroadcast':
                data = { $set: { approvedForBroadcast: false, broadcastOrderingIndex: -1 } };
                break;
            case 'hasBeenAsked':
                data = { $set: { hasBeenAsked: true } };
                break;
            case 'broadcastOrder':
                await db.edit({
                    collection: 'questions',
                    query: {
                        _id: target.questionId
                    },
                    data: { $set: { broadcastOrderingIndex: source.broadcastOrderingIndex } }
                });
                data = { $set: { broadcastOrderingIndex: target.broadcastOrderingIndex } };
                break;
            case 'clearAll':
                await db.remove({ collection: 'questions', query: {} });
                break;
        }

        // execute
        action != 'clearAll' && await db.edit({
            collection: 'questions',
            query: {
                _id: questionId
            },
            data
        });

        switch (action) {
            case 'markQuestionAsRead':
                socketUtils.push('markQuestionAsRead', questionId, serialUserId);
                break;
            case 'discardQuestion':
                socketUtils.push('discardQuestion', questionId, serialUserId);
                break;
            case 'approvedForBroadcast':
                socketUtils.push('approvedForBroadcast', { questionId, index }, serialUserId);
                break;
            case 'disapprovedForBroadcast':
                socketUtils.push('disapprovedForBroadcast', questionId, serialUserId);
                break;
            case 'broadcastOrder':
                socketUtils.push('broadcastOrder', { target, source }, serialUserId);
                break;
            case 'hasBeenAsked':
                socketUtils.push('hasBeenAsked', questionId, serialUserId);
                break;
            case 'clearAll':
                socketUtils.push('clearAll', null, serialUserId);
                break;
        }



        response.json();

    } catch (err) {
        response.status(err.status || 400).json(err.data || { data: { msg: 'question action error', err } });
    }
});
module.exports = router;