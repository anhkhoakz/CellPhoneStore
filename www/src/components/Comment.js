import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const Comment = ({ onSubmitComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = () => {
    if (commentText.trim() === '') {
      alert('Please enter a comment.');
      return;
    }
    onSubmitComment(commentText);
    setCommentText(''); 
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" color="textPrimary" sx={{ mb: 2 }}>
        Add a Comment
      </Typography>
      <TextField
        label="Your Comment"
        multiline
        rows={4}
        fullWidth
        value={commentText}
        onChange={handleCommentChange}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Comment
        </Button>
      </Box>
    </Box>
  );
};

export default Comment;
