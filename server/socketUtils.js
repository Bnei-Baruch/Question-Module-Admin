const db = require('./db');
let io;
let timers = {};

let setSocket = server => {
    console.log('set socket');
    io = require('socket.io')(server);
    io.on('connection', function (client) {
        console.log('socket connect')
        client.on('disconnect', () => console.log('socket disconnect'));
        client.on('editQuestionTranslation', data => {
            timers[data.questionId] && clearTimeout(timers[data.questionId]);
            console.log('editQuestionTranslation', data);
            push('updateQuestionTranslation', {
                questionId: data.questionId,
                text: data.text
            }, data.serialUserId);
            timers[data.questionId] = setTimeout(async () => {
                try {
                    await db.edit({
                        collection: 'questions',
                        query: { _id: data.questionId },
                        data: { $set: {
                            'question.translation.he': data.text
                        }}
                    });
                    console.log('text saved to question');
                } catch (err){
                    console.error('question text saved error', err);
                }
            }, 1000);
        });
    });
}

function push(topic, data, serialUserId) {
    console.log('push socket to client');
    try {
        io.sockets.emit(topic, { data, serialUserId });
    } catch (err) {
        console.log('socket err', err);
    }
}

module.exports = {
    setSocket,
    push
}