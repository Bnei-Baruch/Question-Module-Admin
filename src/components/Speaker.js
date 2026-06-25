import React from 'react';
import { useSelector } from 'react-redux';
import Question from 'components/Question';

export default function Speaker() {
  const questionsReadyForBroadcast = useSelector(state =>
    state.questions
      .slice()
      .sort((a, b) => (a.broadcastOrderingIndex < b.broadcastOrderingIndex ? -1 : 1))
      .filter(q => q.broadcastOrderingIndex > 0 && !q.clear && !!q.approvedForBroadcast && !q.discard && !q.hasBeenAsked)
  );

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <div style={{ width: '100%', height: '100%', overflowY: 'auto', display: 'inline-block' }}>
        {questionsReadyForBroadcast.map((q, idx) => (
          <div key={q._id}>
            <Question
              isFirst={idx === 0}
              isLast={idx === questionsReadyForBroadcast.length - 1}
              showOriginalContent={false}
              unreadColor="#dc39397d"
              readColor="#39dc497d"
              doneBtn arrowUpDown
              idx={idx}
              {...q}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
