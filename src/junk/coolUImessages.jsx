import React, { useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Fab } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SendIcon from '@mui/icons-material/Send';

const Messages = () => {
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [media, setMedia] = useState(null);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [groups, setGroups] = useState([]); // To handle multiple group selection
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [mediaType, setMediaType] = useState(null); // To manage media type

  // Handle the change for uploading media
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    setMedia(file);
  };

  // Schedule the message with the selected time and groups
  const handleSchedule = () => {
    const newMessage = {
      content: messageContent,
      type: messageType,
      media: media,
      scheduledTime: scheduledTime,
      groups: groups,
    };
    setScheduledMessages([...scheduledMessages, newMessage]);
    resetForm();
  };

  // Reset all form fields
  const resetForm = () => {
    setMessageContent('');
    setMessageType('text');
    setMedia(null);
    setScheduledTime(null);
    setGroups([]);
  };

  // Handle submission of the message
  const handleSubmit = () => {
    alert('Message scheduled!');
  };

  // Handle changing message types for different media
  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
  };

  // Handle group selection
  const handleGroupChange = (e) => {
    setGroups(e.target.value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
          Create a Scheduled Message
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18, marginBottom: 5 }}>
          Plan your message to be sent at the right time.
        </Typography>
        <Button
          variant="contained"
          sx={{ fontSize: 16, padding: '12px 24px', borderRadius: 8, boxShadow: 3 }}
          onClick={() => {}}
        >
          Start Scheduling
        </Button>
      </Box>

      {/* Message Creation */}
      <Card sx={{ boxShadow: 5, borderRadius: '16px', padding: 4, marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Create Message
          </Typography>
          <TextField
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel>Message Type</InputLabel>
            <Select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              label="Message Type"
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="document">Document</MenuItem>
              <MenuItem value="file">Any File</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Group Selection */}
      <Card sx={{ boxShadow: 5, borderRadius: '16px', padding: 4, marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Select Groups
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel>Groups</InputLabel>
            <Select
              multiple
              value={groups}
              onChange={handleGroupChange}
              label="Groups"
            >
              <MenuItem value="group1">Group 1</MenuItem>
              <MenuItem value="group2">Group 2</MenuItem>
              <MenuItem value="group3">Group 3</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card sx={{ boxShadow: 5, borderRadius: '16px', padding: 4, marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Upload Media
          </Typography>
          <input
            type="file"
            accept="image/*,video/*,application/*"
            id="upload"
            style={{ display: 'none' }}
            onChange={handleMediaUpload}
          />
          <label htmlFor="upload" style={{ cursor: 'pointer' }}>
            <Button
              variant="contained"
              sx={{ padding: '12px 24px', fontSize: 16, borderRadius: 8, boxShadow: 3 }}
            >
              Upload Media (Image/Video/Document)
            </Button>
          </label>
          {media && (
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Media Preview
              </Typography>
              {mediaType === 'image' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                  <img
                    src={URL.createObjectURL(media)}
                    alt="media preview"
                    style={{
                      width: '300px',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease',
                      cursor: 'zoom-in',
                    }}
                  />
                </Box>
              )}
              {mediaType === 'video' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                  <video controls style={{ width: '300px', borderRadius: '12px' }}>
                    <source src={URL.createObjectURL(media)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card sx={{ boxShadow: 5, borderRadius: '16px', padding: 4, marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Schedule Your Message
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Select Time"
              value={scheduledTime}
              onChange={setScheduledTime}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            sx={{ marginTop: 3, padding: '12px 24px', borderRadius: 8, boxShadow: 3 }}
            onClick={handleSchedule}
          >
            Confirm Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Messages List */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Scheduled Messages
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {scheduledMessages.map((msg, index) => (
            <Card key={index} sx={{ padding: 2, boxShadow: 4, borderRadius: '16px' }}>
              <CardContent>
                <Typography variant="h6">{msg.content}</Typography>
                <Typography variant="body2">
                  {`Scheduled for: ${msg.scheduledTime.toLocaleString()}`}
                </Typography>
                {msg.media && (
                  <Box sx={{ marginTop: 2 }}>
                    {msg.type === 'image' && (
                      <img
                        src={URL.createObjectURL(msg.media)}
                        alt="media"
                        style={{ width: '100%', borderRadius: '12px' }}
                      />
                    )}
                    {msg.type === 'video' && (
                      <video controls style={{ width: '100%', borderRadius: '12px' }}>
                        <source src={URL.createObjectURL(msg.media)} type="video/mp4" />
                      </video>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Send Message Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 40, right: 40 }}
        onClick={handleSubmit}
      >
        <SendIcon />
      </Fab>
    </Box>
  );
};

export default Messages;


// Dashboard.jsx
import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {/* Message Overview */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Messages</Typography>
              <Typography variant="body2">Sent: 120</Typography>
              <Typography variant="body2">Received: 140</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Contacts Overview */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Contacts</Typography>
              <Typography variant="body2">Total Contacts: 50</Typography>
              <Typography variant="body2">New Contacts: 5</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Groups Overview */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Groups</Typography>
              <Typography variant="body2">Total Groups: 10</Typography>
              <Typography variant="body2">Active Groups: 7</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
