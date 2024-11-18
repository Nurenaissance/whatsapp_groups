import React, { useState } from 'react';
import { Typography, Button, TextField, Grid, Card, CardContent, Box, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adapter for date-fns
import { LocalizationProvider } from '@mui/x-date-pickers';
import MediaPreview from './mediapreview'; // Import MediaPreview component
import ScheduledMessages from './scheduledmessage';
const Messages = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [messageType, setMessageType] = useState('text');
  const [scheduledTime, setScheduledTime] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [scheduledMessages, setScheduledMessages] = useState([]);

  const handleGroupChange = (event) => {
    setSelectedGroups(event.target.value);
  };

  const handleSubmit = () => {
    if (!scheduledTime || (!messageContent && !media)) {
      alert("Please fill all fields and schedule the message!");
      return;
    }

    const newMessage = {
      groups: selectedGroups,
      messageType,
      content: messageContent,
      media,
      caption: mediaCaption,
      scheduledTime,
    };

    setScheduledMessages([...scheduledMessages, newMessage]);
    setMessageContent('');
    setScheduledTime(null);
    setMedia(null);
    setMediaCaption('');
    setSelectedGroups([]);
  };
  const handleDeleteScheduledMessage = (index) => {
    const updatedMessages = scheduledMessages.filter((_, i) => i !== index);
    setScheduledMessages(updatedMessages);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f4f7fa', borderRadius: '12px', boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Schedule Messages
      </Typography>

      {/* Group Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Choose Groups</InputLabel>
        <Select
          multiple
          value={selectedGroups}
          onChange={handleGroupChange}
          label="Choose Groups"
          renderValue={(selected) => selected.join(', ')}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
          }}
        >
          <MenuItem value="Group 1">Group 1</MenuItem>
          <MenuItem value="Group 2">Group 2</MenuItem>
          <MenuItem value="Group 3">Group 3</MenuItem>
        </Select>
        <FormHelperText>Select multiple groups</FormHelperText>
      </FormControl>

      {/* Message Type Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Message Type</InputLabel>
        <Select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          label="Message Type"
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
          }}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="document">Document</MenuItem>
          <MenuItem value="voice">Voice Note</MenuItem>
        </Select>
      </FormControl>

      {/* Message Content */}
      {messageType === 'text' ? (
        <TextField
          label="Enter your message"
          fullWidth
          multiline
          rows={4}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          sx={{
            mb: 3,
            borderRadius: '8px',
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ccc' },
            },
          }}
        />
      ) : null}

      {/* Media Upload */}
      {['image', 'video'].includes(messageType) && (
        <Card sx={{ mb: 3, borderRadius: '12px', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Upload
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: '#0078d4',
                color: 'white',
                '&:hover': { backgroundColor: '#005fa2' },
                borderRadius: '8px',
                padding: '10px 20px',
              }}
            >
              {`Upload ${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`}
              <input
                type="file"
                hidden
                onChange={(e) => setMedia(e.target.files[0])}
              />
            </Button>
            {media && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {media.name}
              </Typography>
            )}
            {/* Media Caption */}
            <TextField
              label="Enter Caption"
              fullWidth
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
              sx={{
                mt: 2,
                backgroundColor: '#fff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ccc' } },
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Date and Time Picker for scheduling */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Schedule Time"
          value={scheduledTime}
          onChange={setScheduledTime}
          renderInput={(props) => (
            <TextField {...props} fullWidth sx={{ mb: 3, backgroundColor: '#fff', borderRadius: '8px' }} />
          )}
        />
      </LocalizationProvider>

      {/* Schedule Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          mt: 3,
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '50px',
          '&:hover': { backgroundColor: '#388e3c' },
        }}
      >
        Schedule Message
      </Button>

      {/* Preview Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">Preview</Typography>
        <Box sx={{ mb: 3 }}>
        <MediaPreview media={media} caption={mediaCaption} messageType={messageType} messageContent={messageContent} />
        </Box>
        {/*messageContent && <Typography variant="body1">{messageContent}</Typography>*/}
        {scheduledTime && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Scheduled at: {new Date(scheduledTime).toLocaleString()}
          </Typography>
        )}
      </Box>

      {/* Scheduled Messages */}
      <ScheduledMessages
        scheduledMessages={scheduledMessages}
        onDelete={handleDeleteScheduledMessage}
      />
    </Box>
  );
};

export default Messages;
