import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Tags() {
  const [newTag, setNewTag] = useState('');

  const addNewTag = async () => {
    // tag creation logic (stub)
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', padding: 20 }}>
      <div style={{ fontSize: 24 }}>Tags</div>
      <div>
        <TextField
          id="insert-tag"
          label="Tag"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          margin="normal"
        />
        <div style={{ position: 'relative', top: 26, left: 5, display: 'inline-block' }}>
          <Button onClick={addNewTag} variant="outlined" color="primary" disabled={!newTag}>+</Button>
        </div>
      </div>
    </div>
  );
}
