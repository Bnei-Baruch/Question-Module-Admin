import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
  name: 'questions',
  initialState: [],
  reducers: {
    setQuestions:             (state, { payload }) => [...payload].reverse(),
    addQuestion:              (state, { payload }) => { state.push(payload); },
    editQuestionTranslation:  (state, { payload: { questionId, text } }) => {
      const q = state.find(q => q._id === questionId);
      if (q) q.question.translation.he = text;
    },
    markQuestionAsRead:       (state, { payload }) => {
      const q = state.find(q => q._id === payload);
      if (q) q.hasBeenRead = true;
    },
    discardQuestion:          (state, { payload }) => {
      const q = state.find(q => q._id === payload);
      if (q) q.discard = true;
    },
    approvedForBroadcast:     (state, { payload: { questionId, index } }) => {
      const q = state.find(q => q._id === questionId);
      if (q) { q.approvedForBroadcast = true; q.broadcastOrderingIndex = index; }
    },
    disapprovedForBroadcast:  (state, { payload }) => {
      const q = state.find(q => q._id === payload);
      if (q) { q.approvedForBroadcast = false; q.broadcastOrderingIndex = -1; }
    },
    hasBeenAsked:             (state, { payload }) => {
      const q = state.find(q => q._id === payload);
      if (q) q.hasBeenAsked = true;
    },
    broadcastOrder:           (state, { payload: { source, target } }) => {
      const sq = state.find(q => q._id === source.questionId);
      const tq = state.find(q => q._id === target.questionId);
      if (sq) sq.broadcastOrderingIndex = target.broadcastOrderingIndex;
      if (tq) tq.broadcastOrderingIndex = source.broadcastOrderingIndex;
    },
    clearAll:                 () => [],
  },
});

export const {
  setQuestions,
  addQuestion,
  editQuestionTranslation,
  markQuestionAsRead,
  discardQuestion,
  approvedForBroadcast,
  disapprovedForBroadcast,
  hasBeenAsked,
  broadcastOrder,
  clearAll,
} = questionsSlice.actions;

// Aliases used by socket.js (keep same names the socket dispatches)
export const _setQuestions             = setQuestions;
export const _editQuestionTranslation  = editQuestionTranslation;
export const _markQuestionAsRead       = markQuestionAsRead;
export const _discardQuestion          = discardQuestion;
export const _approvedForBroadcast     = approvedForBroadcast;
export const _disapprovedForBroadcast  = disapprovedForBroadcast;
export const _hasBeenAsked             = hasBeenAsked;
export const _broadcastOrder           = broadcastOrder;
export const _clearAll                 = clearAll;
export const updateQuestionTranslation = editQuestionTranslation;

export default questionsSlice.reducer;
