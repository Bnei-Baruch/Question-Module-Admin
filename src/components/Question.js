import React from 'react';
import { useDispatch } from 'react-redux';
import { displayName } from 'utils/translitName';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Moment from 'react-moment';
import Edit from 'components/Edit';
import { askNotification } from 'actions/notification';
import {
  markQuestionAsRead,
  discardQuestion,
  hasBeenAsked,
  approvedForBroadcast,
  disapprovedForBroadcast,
  broadcastOrderDown,
  broadcastOrderUp,
} from 'actions/questions';

export default function Question(props) {
  const dispatch = useDispatch();
  const {
    _id, timestamp, hasBeenRead, readColor, unreadColor, user,
    question, showOriginalContent, arrowRight, arrowLeft, arrowUpDown,
    doneBtn, isFirst, isLast, idx, ravView, askForMe,
  } = props;

  const handleDiscard = () => {
    dispatch(askNotification(() => dispatch(discardQuestion(_id))));
  };

  const handleHasBeenAsked = () => {
    dispatch(askNotification(() => dispatch(hasBeenAsked(_id))));
  };

  const transliterated = displayName(user.name);
  const showTranslit = transliterated !== user.name;
  const transliteratedRoom = displayName(user.galaxyRoom);
  const showTranslitRoom = transliteratedRoom !== user.galaxyRoom;

  return (
    <div style={{ margin: 10 }}>
      <Paper
        style={{ padding: 20, position: 'relative', background: hasBeenRead ? readColor : unreadColor }}
        onClick={() => dispatch(markQuestionAsRead(_id))}>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          {doneBtn && (
            <IconButton onClick={handleHasBeenAsked}><Icon fontSize="small">done_outline</Icon></IconButton>
          )}
          {arrowRight && (
            <IconButton onClick={() => dispatch(approvedForBroadcast(_id))}><Icon fontSize="small">arrow_forward</Icon></IconButton>
          )}
          {arrowLeft && (
            <IconButton onClick={() => dispatch(disapprovedForBroadcast(_id))}><Icon fontSize="small">arrow_backward</Icon></IconButton>
          )}
          {arrowUpDown && (
            <>
              <IconButton disabled={isLast} onClick={() => dispatch(broadcastOrderDown(idx))}><Icon fontSize="small">arrow_downward</Icon></IconButton>
              <IconButton disabled={isFirst} onClick={() => dispatch(broadcastOrderUp(idx))}><Icon fontSize="small">arrow_upward</Icon></IconButton>
            </>
          )}
          <IconButton onClick={handleDiscard}><Icon fontSize="small">delete</Icon></IconButton>
        </div>
        <div style={{ color: '#777' }}>
          <Moment format="DD-MMM HH:mm">{timestamp}</Moment>
          {!askForMe && (
            <div>
              {ravView && (
                <div style={{ fontSize: 36, display: 'inline-block', fontWeight: 'bold', color: 'black' }}>{user.galaxyRoom}</div>
              )}
              <div style={{ color: 'black', fontWeight: 'bold' }}>
                <div style={{ fontSize: 36, background: 'yellow', padding: 5, display: 'inline-block', width: 36, margin: 5, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>?</div>
                {!ravView && <span>I want to ask myself</span>}
              </div>
            </div>
          )}
          <div style={{ marginTop: 10, marginBottom: 5 }}>
            <span style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>{user.name} {user.galaxyRoom}</span>
          </div>
        </div>
        {!!question.content && showOriginalContent && question.content !== question.translation.he && (
          <div style={{ marginTop: 10 }}>{question.content}</div>
        )}
        <div style={{ marginTop: 10 }}>
          {(showTranslit || showTranslitRoom) && (
            <div style={{ fontSize: 16, color: '#000', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'right', marginBottom: 4 }}>
              {showTranslit ? transliterated : user.name} {transliteratedRoom}
            </div>
          )}
          <Edit questionId={_id} />
        </div>
      </Paper>
    </div>
  );
}
