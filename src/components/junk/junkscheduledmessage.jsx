import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ScheduledMessages = ({ scheduledMessages, onDelete }) => {
  return (
    <div>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Scheduled Messages
      </Typography>
      {scheduledMessages.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No messages scheduled yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {scheduledMessages.map((msg, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ borderRadius: '12px', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {msg.groups.join(', ')} - {msg.messageType.charAt(0).toUpperCase() + msg.messageType.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Scheduled at: {new Date(msg.scheduledTime).toLocaleString()}
                  </Typography>
                  {msg.messageType === 'text' && <Typography variant="body2">{msg.content}</Typography>}
                  {msg.media && <Typography variant="body2">{msg.media.name}</Typography>}
                  {msg.caption && <Typography variant="body2">{msg.caption}</Typography>}
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => onDelete(index)} // Call the onDelete function passed as prop
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ScheduledMessages;
