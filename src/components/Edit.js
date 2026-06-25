import React, { useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSelector, useDispatch } from 'react-redux';
import { editQuestionTranslationAsync } from 'actions/questions';

export default function Edit({ questionId }) {
  const contentEditable = useRef(null);
  const dispatch = useDispatch();
  const html = useSelector(state => {
    const q = state.questions.find(q => q._id == questionId);
    const translation = q && q.question && q.question.translation;
    return translation ? translation.he : '';
  });

  const handleChange = evt => {
    dispatch(editQuestionTranslationAsync(questionId, evt.target.value));
  };

  return (
    <ContentEditable
      style={{ direction: 'rtl' }}
      innerRef={contentEditable}
      html={html || ''}
      disabled={false}
      onChange={handleChange}
      tagName="article"
    />
  );
}
