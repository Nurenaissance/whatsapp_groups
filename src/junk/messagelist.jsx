import React from 'react';
import { List, ListItem, Box, Typography } from '@mui/material';
import { useGroup } from '../contexts/groupcontext';
//import Message from './message';

function MessageList() {
  const { messages } = useGroup();

  return (
    <Box>
      <Typography variant="h6">Messages</Typography>
      <List>
        
      </List>
    </Box>
  );
}

export default MessageList;
