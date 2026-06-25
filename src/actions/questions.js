export {
  setQuestions as _setQuestions,
  addQuestion,
  editQuestionTranslation as _editQuestionTranslation,
  markQuestionAsRead as _markQuestionAsRead,
  discardQuestion as _discardQuestion,
  approvedForBroadcast as _approvedForBroadcast,
  disapprovedForBroadcast as _disapprovedForBroadcast,
  hasBeenAsked as _hasBeenAsked,
  broadcastOrder as _broadcastOrder,
  clearAll as _clearAll,
  updateQuestionTranslation,
} from '../reducers/questions';

import { api } from '../utils/data';
import { pushToServerEditQuestionTranslation } from 'utils/socket';
import {
  setQuestions,
  editQuestionTranslation,
  markQuestionAsRead as _markRead,
  discardQuestion as _discard,
  approvedForBroadcast as _approve,
  disapprovedForBroadcast as _disapprove,
  hasBeenAsked as _asked,
  broadcastOrder as _order,
  clearAll as _clearAllAction,
} from '../reducers/questions';
import { showNotification } from '../reducers/notification';

let timers = {};

export const editQuestionTranslationAsync = (questionId, text) => dispatch => {
  dispatch(editQuestionTranslation({ questionId, text }));
  timers[questionId] && clearTimeout(timers[questionId]);
  timers[questionId] = setTimeout(() => {
    pushToServerEditQuestionTranslation(questionId, text);
  }, 300);
};

export const getQuestions = () => async dispatch => {
  const questions = await api({ type: 'getQuestions' });
  dispatch(setQuestions(questions));
};

export const markQuestionAsRead = questionId => async (dispatch, getState) => {
  if (!getState().questions.find(q => q._id === questionId)?.hasBeenRead) {
    dispatch(_markRead(questionId));
    await api({ type: 'questionAction', data: { action: 'markQuestionAsRead', questionId } });
  }
};

export const discardQuestion = questionId => async dispatch => {
  dispatch(_discard(questionId));
  await api({ type: 'questionAction', data: { action: 'discardQuestion', questionId } });
};

export const disapprovedForBroadcast = questionId => async dispatch => {
  dispatch(_disapprove(questionId));
  await api({ type: 'questionAction', data: { action: 'disapprovedForBroadcast', questionId } });
};

export const approvedForBroadcast = questionId => async dispatch => {
  const index = new Date().getTime();
  dispatch(_approve({ questionId, index }));
  await api({ type: 'questionAction', data: { action: 'approvedForBroadcast', questionId, index } });
};

export const clearAll = () => async dispatch => {
  dispatch(_clearAllAction());
  await api({ type: 'questionAction', data: { action: 'clearAll' } });
};

export const hasBeenAsked = questionId => async dispatch => {
  dispatch(_asked(questionId));
  await api({ type: 'questionAction', data: { action: 'hasBeenAsked', questionId } });
};

export const broadcastOrderDown = idx => async (dispatch, getState) => {
  const questions = getState().questions
    .slice().sort((a, b) => a.broadcastOrderingIndex - b.broadcastOrderingIndex)
    .filter(q => q.broadcastOrderingIndex > 0 && !q.clear && q.approvedForBroadcast && !q.discard);
  const source = { questionId: questions[idx]._id,     broadcastOrderingIndex: questions[idx].broadcastOrderingIndex };
  const target = { questionId: questions[idx + 1]._id, broadcastOrderingIndex: questions[idx + 1].broadcastOrderingIndex };
  dispatch(_order({ source, target }));
  await api({ type: 'questionAction', data: { action: 'broadcastOrder', target, source, questionId: source.questionId } });
};

export const broadcastOrderUp = idx => async (dispatch, getState) => {
  const questions = getState().questions
    .slice().sort((a, b) => a.broadcastOrderingIndex - b.broadcastOrderingIndex)
    .filter(q => q.broadcastOrderingIndex > 0 && !q.clear && q.approvedForBroadcast && !q.discard);
  const source = { questionId: questions[idx]._id,     broadcastOrderingIndex: questions[idx].broadcastOrderingIndex };
  const target = { questionId: questions[idx - 1]._id, broadcastOrderingIndex: questions[idx - 1].broadcastOrderingIndex };
  dispatch(_order({ source, target }));
  await api({ type: 'questionAction', data: { action: 'broadcastOrder', target, source, questionId: source.questionId } });
};
