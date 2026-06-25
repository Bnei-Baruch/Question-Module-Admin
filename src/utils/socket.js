
import io from 'socket.io-client';
import { api } from 'utils/data';
import { store } from 'store/configureStore';
import * as QuestionActions from 'actions/questions';

let socket;

export const piResponseListener = requestId => {
    return new Promise((resolve, reject) => {
        socket.on(requestId, data => resolve(data));
    });
}

export const connectSocket = (dispatch, getState) => {
    console.log('connecting socket...');
    socket = io(window.location.origin.indexOf('localhost') !== -1 ? 'http://10.77.1.72:2200' : window.location.origin);

    socket.on('connect', () => {
        console.log('socket connect');
    });

    socket.on('newQuestion', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server newQuestion', cfg);
        dispatch(QuestionActions.addQuestion(cfg.data));
    });

    socket.on('markQuestionAsRead', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server markQuestionAsRead', cfg);
        dispatch(QuestionActions._markQuestionAsRead(cfg.data));
    });

    socket.on('discardQuestion', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server discardQuestion', cfg);
        dispatch(QuestionActions._discardQuestion(cfg.data));
    });

    socket.on('approvedForBroadcast', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server approvedForBroadcast', cfg);
        dispatch(QuestionActions._approvedForBroadcast(cfg.data));
    });

    socket.on('disapprovedForBroadcast', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server approvedForBroadcast', cfg);
        dispatch(QuestionActions._disapprovedForBroadcast(cfg.data));
    });

    socket.on('updateQuestionTranslation', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server updateQuestionTranslation', cfg);
        dispatch(QuestionActions.updateQuestionTranslation({...cfg.data}));
    });

    socket.on('broadcastOrder', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server broadcastOrder', cfg);
        dispatch(QuestionActions._broadcastOrder({...cfg.data}));
    });

    socket.on('hasBeenAsked', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server hasBeenAsked', cfg);
        dispatch(QuestionActions._hasBeenAsked(cfg.data));
    });

    socket.on('clearAll', async cfg => {
        if (cfg.serialUserId == getState().user.serialUserId){
            console.log('self socket - exit');
            return false;
        }
        console.log('push from server clear all', cfg);
        dispatch(QuestionActions._clearAll());
    });

    socket.on('disconnect', function () {
        console.log('socket DISCONNECT');
    });
}

export const pushToServerEditQuestionTranslation = (questionId, text) => {
    socket.emit('editQuestionTranslation', {questionId, text, serialUserId: store.getState().user.serialUserId});
}