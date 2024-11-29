import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const ShowComment = ({ comment }) => {
  const { username, content, date } = comment;

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
        {username}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        {new Date(date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" color="textPrimary">
        {content}
      </Typography>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default ShowComment;
