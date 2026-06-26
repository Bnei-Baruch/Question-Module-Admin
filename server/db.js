const mongoose = require('mongoose');
const fs = require('fs');
const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/galaxyQuestionAdmin';

const UserModel = mongoose.model('User', {
    userName: String,
    userId: String,
    roomName: String,
    roomId: String,
    created: Number,
    updated: Number,
    timestamp: Number,
    status: { type: Boolean, default: true },
    groupName: String,
    wc: String
});

const TagsModel = mongoose.model('Tag', {
    name: String,
    id: Number
});

const QuestionModel = mongoose.model('Question', {
    timestamp: Number,
    askForMe: { type: Boolean, default: true },
    question: {
        content: String,
        translation: {}
    },
    user: {
        name: String,
        gender: { type: String, enum: ['male', 'female'] },
        galaxyRoom: String,
        serialUserId: String
    },
    approvedForBroadcast: { type: Boolean, default: false },
    broadcastOrderingIndex: { type: Number, default: -1 },
    clear: { type: Boolean, default: false },
    hasBeenAsked: { type: Boolean, default: false },
    discard: { type: Boolean, default: false },
    hasBeenRead: { type: Boolean, default: false }
});

const collectionMap = {
    users: UserModel,
    questions: QuestionModel,
    tags: TagsModel
};

const remove = async cfg => {
    await collectionMap[cfg.collection].deleteMany(cfg.query);
};

const edit = async cfg => {
    console.log(Date(), '******edit');
    try {
        if (cfg.multi) {
            await collectionMap[cfg.collection].updateMany(cfg.query, cfg.data);
            return {};
        } else {
            return await collectionMap[cfg.collection].findOneAndUpdate(cfg.query, cfg.data, { new: true });
        }
    } catch (err) {
        throw { status: 500, data: { msg: 'db error', err } };
    }
};

const get = async cfg => {
    console.log(Date(), '****** get', cfg.collection);
    try {
        return await collectionMap[cfg.collection].find(cfg.query);
    } catch (err) {
        throw { status: 500, data: { msg: 'db error', err } };
    }
};

const getWithLimit = async cfg => {
    console.log('****** getWithLimit', cfg);
    try {
        return await collectionMap[cfg.collection].find(cfg.query).limit(cfg.limit);
    } catch (err) {
        throw { status: 500, data: { msg: 'db error', err } };
    }
};

const create = async cfg => {
    try {
        const newItem = new collectionMap[cfg.collection](cfg.data);
        return await newItem.save();
    } catch (err) {
        throw { status: 405, data: { msg: 'DB create err', err } };
    }
};

const findOneAndUpdate = async cfg => {
    try {
        return await collectionMap[cfg.collection].findOneAndUpdate(cfg.query, cfg.data, {
            new: true,
            upsert: true
        });
    } catch (err) {
        throw { status: 405, data: { msg: 'DB create err', err } };
    }
};

const createMany = async ({ docs, collection }) => {
    await collectionMap[collection].insertMany(docs);
};

const distinct = async ({ collection, fieldName, query }) => {
    return await collectionMap[collection].find(query).distinct(fieldName);
};

const connect = async () => {
    try {
        await mongoose.connect(connectionString);
        if (!fs.existsSync('./images')) fs.mkdirSync('./images');
        console.log('mongo db connection [success]');
    } catch (err) {
        console.log('mongo db connection [error]: ' + err);
    }
};

module.exports = {
    remove,
    edit,
    get,
    create,
    createMany,
    getWithLimit,
    distinct,
    connect,
    findOneAndUpdate
};
