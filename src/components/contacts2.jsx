import React, { useState } from 'react';
import { Typography, Button, Card, CardContent, Grid, Rating, Box, Divider, Tabs, Tab, TextField } from '@mui/material';

// Example Data (In a real app, this data would be fetched from an API or a backend)
const groups = [
  {
    name: 'Group A',
    members: [
      { id: 1, name: 'John Doe', status: 'Available', rating: 4, role: 'admin' },
      { id: 2, name: 'Jane Smith', status: 'Away', rating: 3, role: 'member' },
      { id: 3, name: 'Samuel L.', status: 'Do not Disturb', rating: 5, role: 'member' },
      // Add more members if needed
    ]
  },
  {
    name: 'Group B',
    members: [
      { id: 4, name: 'Alice Johnson', status: 'Available', rating: 2, role: 'member' },
      { id: 5, name: 'Bob Lee', status: 'Offline', rating: 1, role: 'admin' },
      // Add more members if needed
    ]
  }
];

const Contacts = () => {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [ratings, setRatings] = useState(groups);
  const [messages, setMessages] = useState({}); // Store messages for each contact

  // Function to handle rating change
  const handleRatingChange = (groupIndex, memberId, newRating) => {
    const updatedGroups = [...ratings];
    const memberIndex = updatedGroups[groupIndex].members.findIndex(member => member.id === memberId);
    updatedGroups[groupIndex].members[memberIndex].rating = newRating;
    setRatings(updatedGroups);
  };

  // Function to handle sending a personal message
  const handleSendMessage = (memberId) => {
    const message = messages[memberId]; // Get the message for the current member
    if (message) {
      console.log(`Sent message to member ${memberId}: ${message}`);
      // Reset the message input after sending
      setMessages((prevMessages) => ({ ...prevMessages, [memberId]: '' }));
    } else {
      alert('Please enter a message before sending!');
    }
  };

  // Function to handle message change for a specific member
  const handleMessageChange = (memberId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [memberId]: newMessage,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Contacts
      </Typography>

      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Sync Contacts
      </Button>

      {/* Group Switcher */}
      <Tabs
        value={selectedGroupIndex}
        onChange={(e, newValue) => setSelectedGroupIndex(newValue)}
        indicatorColor="primary"
        textColor="primary"
        aria-label="Group Tabs"
      >
        {groups.map((group, index) => (
          <Tab label={group.name} key={index} />
        ))}
      </Tabs>

      {/* Display Members of the Selected Group */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>{groups[selectedGroupIndex].name}</Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Admins Section */}
        <Typography variant="h6" gutterBottom>
          Admins
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {groups[selectedGroupIndex].members
            .filter(member => member.role === 'admin')
            .map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{member.name}</Typography>
                    <Rating
                      value={member.rating}
                      onChange={(_, newRating) => handleRatingChange(selectedGroupIndex, member.id, newRating)}
                      precision={1}
                      max={5}
                      sx={{ mb: 1 }}
                    />

                    {/* Send Personal Message */}
                    <TextField
                      label="Send Message"
                      variant="outlined"
                      fullWidth
                      value={messages[member.id] || ''} // Get the message for this specific member
                      onChange={(e) => handleMessageChange(member.id, e.target.value)} // Update the specific message for the member
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => handleSendMessage(member.id)} // Send the message for the specific member
                    >
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Members Section */}
        <Typography variant="h6" gutterBottom>
          Members
        </Typography>
        <Grid container spacing={2}>
          {groups[selectedGroupIndex].members
            .filter(member => member.role === 'member')
            .map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{member.name}</Typography>
                    <Rating
                      value={member.rating}
                      onChange={(_, newRating) => handleRatingChange(selectedGroupIndex, member.id, newRating)}
                      precision={1}
                      max={5}
                      sx={{ mb: 1 }}
                    />

                    {/* Send Personal Message */}
                    <TextField
                      label="Send Message"
                      variant="outlined"
                      fullWidth
                      value={messages[member.id] || ''} // Get the message for this specific member
                      onChange={(e) => handleMessageChange(member.id, e.target.value)} // Update the specific message for the member
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => handleSendMessage(member.id)} // Send the message for the specific member
                    >
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Contacts;
