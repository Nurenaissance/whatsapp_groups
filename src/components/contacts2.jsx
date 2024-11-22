import React, { useState, useMemo } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Rating, 
  Box, 
  Divider, 
  Tabs, 
  Tab, 
  TextField, 
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Message as MessageIcon, 
  PersonAdd as PersonAddIcon, 
  Sync as SyncIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';

// Example Data (In a real app, this data would be fetched from an API or a backend)
const initialGroups = [
  {
    name: 'Group A',
    description: 'Core Product Team',
    members: [
      { id: 1, name: 'John Doe', status: 'Available', rating: 4, role: 'admin', email: 'john.doe@company.com', avatar: '/path/to/avatar1.jpg' },
      { id: 2, name: 'Jane Smith', status: 'Away', rating: 3, role: 'member', email: 'jane.smith@company.com', avatar: '/path/to/avatar2.jpg' },
      { id: 3, name: 'Samuel L.', status: 'Do not Disturb', rating: 5, role: 'member', email: 'samuel.l@company.com', avatar: '/path/to/avatar3.jpg' },
    ]
  },
  {
    name: 'Group B',
    description: 'Marketing Team',
    members: [
      { id: 4, name: 'Alice Johnson', status: 'Available', rating: 2, role: 'member', email: 'alice.johnson@company.com', avatar: '/path/to/avatar4.jpg' },
      { id: 5, name: 'Bob Lee', status: 'Offline', rating: 1, role: 'admin', email: 'bob.lee@company.com', avatar: '/path/to/avatar5.jpg' },
    ]
  }
];

const Contacts = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [ratings, setRatings] = useState(groups);
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle rating change
  const handleRatingChange = (groupIndex, memberId, newRating) => {
    const updatedGroups = [...ratings];
    const memberIndex = updatedGroups[groupIndex].members.findIndex(member => member.id === memberId);
    updatedGroups[groupIndex].members[memberIndex].rating = newRating;
    setRatings(updatedGroups);
  };

  // Function to handle sending a personal message
  const handleSendMessage = (memberId) => {
    const message = messages[memberId];
    if (message) {
      console.log(`Sent message to member ${memberId}: ${message}`);
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

  // Filtered and sorted members
  const filteredMembers = useMemo(() => {
    const currentGroup = groups[selectedGroupIndex];
    return currentGroup.members
      .filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by role (admins first) and then by name
        if (a.role !== b.role) {
          return a.role === 'admin' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  }, [groups, selectedGroupIndex, searchTerm]);

  return (
    <Box sx={{ 
      padding: 3, 
      maxWidth: 1200, 
      margin: 'auto', 
      backgroundColor: theme => theme.palette.background.default 
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" gutterBottom>
          Team Contacts
        </Typography>
        <Box>
          <Tooltip title="Sync Contacts">
            <IconButton color="primary">
              <SyncIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New Member">
            <IconButton color="secondary">
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Group Switcher */}
     <Tabs
  value={selectedGroupIndex}
  onChange={(e, newValue) => setSelectedGroupIndex(newValue)}
  indicatorColor="primary"
  textColor="primary"
  variant="scrollable" // Makes the tabs scrollable
  scrollButtons="auto" // Shows scroll buttons when needed
  sx={{ mb: 3 }}
>
  {groups.map((group, index) => (
    <Tab
      key={index}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {group.name}
          <Chip
            label={group.members.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
      }
    />
  ))}
</Tabs>


      {/* Group Info and Search */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {groups[selectedGroupIndex].name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {groups[selectedGroupIndex].description}
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': { 
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Avatar 
                    src={member.avatar} 
                    alt={member.name} 
                    sx={{ mr: 2, width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">{member.name}</Typography>
                    <Chip 
                      icon={member.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                      label={member.role} 
                      size="small" 
                      color={member.role === 'admin' ? 'primary' : 'default'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {member.email}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Performance Rating:
                  </Typography>
                  <Rating
                    value={member.rating}
                    onChange={(_, newRating) => handleRatingChange(selectedGroupIndex, member.id, newRating)}
                    precision={1}
                    max={5}
                  />
                </Box>

                <TextField
                  label="Send Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={messages[member.id] || ''}
                  onChange={(e) => handleMessageChange(member.id, e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<MessageIcon />}
                  onClick={() => handleSendMessage(member.id)}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Contacts;