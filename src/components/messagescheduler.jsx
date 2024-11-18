import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const MessageScheduler = ({ phoneNumber = "1234567890" }) => {
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [scheduledMessages, setScheduledMessages] = useState([]);

  const handleSchedule = () => {
    if (!message.trim() && !mediaFile) {
      alert('Please enter a message or upload a media file.');
      return;
    }
    if (!scheduleTime) {
      alert('Please select a schedule time.');
      return;
    }

    // Create a new scheduled message object
    const newSchedule = {
      id: Date.now(),
      message,
      scheduleTime,
      mediaFile,
      type: mediaFile ? (mediaFile.type.startsWith("video") ? "video" : "image") : "text",
    };

    // Add to the scheduled messages list
    setScheduledMessages([...scheduledMessages, newSchedule]);

    // Clear input fields after scheduling
    setMessage('');
    setScheduleTime('');
    setMediaFile(null);

    alert(`Message scheduled for ${scheduleTime}`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Schedule Message
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Scheduling for: {phoneNumber}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />

        <TextField
          label="Schedule Time"
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          variant="contained"
          component="label"
          fullWidth
          color="secondary"
        >
          Upload Image/Video
          <input
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSchedule}
          fullWidth
        >
          Schedule Message
        </Button>
      </Box>

      {/* Display scheduled messages */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Scheduled Messages
      </Typography>
      <List>
        {scheduledMessages.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemAvatar>
              {msg.type === "text" && <Avatar><Typography>T</Typography></Avatar>}
              {msg.type === "image" && (
                <Avatar>
                  <InsertPhotoIcon />
                </Avatar>
              )}
              {msg.type === "video" && (
                <Avatar>
                  <VideoLibraryIcon />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={`Scheduled at: ${msg.scheduleTime}`}
              secondary={
                <>
                  {msg.message && <Typography variant="body2">{msg.message}</Typography>}
                  {msg.mediaFile && <Typography variant="body2">File: {msg.mediaFile.name}</Typography>}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MessageScheduler;
