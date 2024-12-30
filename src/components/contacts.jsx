import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Rating, 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';

import { 
  Message as MessageIcon, 
  PersonAdd as PersonAddIcon, 
  Sync as SyncIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import axiosInstance from './api';
// Dummy Endpoints
const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

const tenantId=getTenantIdFromUrl();
const API_ENDPOINTS = {
  getGroups: '/group_details/get_groups',
  updateRating: '/contact/update-rating',
  sendMessage: 'https://whatsappbot.centralus.cloudapp.azure.com/messaging/send',
  addMember: 'https://mocki.io/v1/736d0752-aa21-4bac-83a3-6af6189d7e12',
  syncContacts: 'https://whatsappbot.centralus.cloudapp.azure.com/group_details/fetch_groups'
};

const ContactsComponent = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch groups on component mount
  useEffect(() => {
  
const fetchGroups = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(API_ENDPOINTS.getGroups);
    
    // Validate response data
    const fetchedGroups = response.data?.groups || [];
    const sanitizedGroups = fetchedGroups.map(group => ({
      ...group,
      name: group.name || 'Unnamed Group',
      description: group.description || 'No description',
      members: (group.members || []).map(member => ({
        ...member,
        name: member.name || 'Unknown Member',
        email: member.email || 'No email',
        role: member.role || 'member',
        rating: member.rating || 0,
        id: member.id || crypto.randomUUID() // Ensure unique ID
      }))
    }));

    setGroups(sanitizedGroups);
    setSelectedGroupIndex(0); // Reset to first group
    setLoading(false);
  } catch (err) {
    console.error('Fetch groups error:', err);
    setError('Failed to fetch groups: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    setLoading(false);
    enqueueSnackbar('Failed to fetch groups', { 
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      autoHideDuration: 3000,
    });
  }
};
    
    fetchGroups();
  }, [enqueueSnackbar]);

  // Handle rating change
  const handleRatingChange = async (groupIndex, memberId, newRating) => {
    try {
      const group = groups[groupIndex];
      if (!group) {
        enqueueSnackbar('Invalid group selection', { variant: 'error' });
        return;
      }

      const member = group.members.find(m => m.id === memberId);
      if (!member) {
        enqueueSnackbar('Member not found', { variant: 'error' });
        return;
      }

      const ratingData = {
        group_id: group.id,
        member_id: member.id,
        rating: newRating
      };

      await axiosInstance.put(API_ENDPOINTS.updateRating, ratingData);
      
      const updatedGroups = groups.map((g, index) => 
        index === groupIndex 
          ? {
              ...g,
              members: g.members.map(m => 
                m.id === memberId 
                  ? { ...m, rating: newRating } 
                  : m
              )
            }
          : g
      );
      
      setGroups(updatedGroups);

      enqueueSnackbar('Rating updated successfully', { variant: 'success' });
    } catch (err) {
      console.error('Rating update error:', err);
      enqueueSnackbar('Failed to update rating', { variant: 'error' });
    }
  };

  // Handle sending a message
  const handleSendMessage = async (memberId, memberName) => {
    const message = messages[memberId];
    if (!message) {
      enqueueSnackbar('Please enter a message before sending!', { 
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 2000,
      });
      return;
    }

    try {
      const messageData = {
        name: memberName,
        message: message
      };

      await axios.post(API_ENDPOINTS.sendMessage, messageData);

      setMessages(prev => ({ ...prev, [memberId]: '' }));
      
      enqueueSnackbar('Message sent successfully!', { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 2000,
      });
    } catch (err) {
      console.error('Message send error:', err);
      enqueueSnackbar('Failed to send message', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    }
  };
  // Handle message input change
  const handleMessageChange = (memberId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [memberId]: newMessage,
    }));
  };

  // Sync contacts
  const handleSyncContacts = async () => {
    // Create a full-screen loader div
    const loaderOverlay = document.createElement('div');
    loaderOverlay.style.position = 'fixed';
    loaderOverlay.style.top = '0';
    loaderOverlay.style.left = '0';
    loaderOverlay.style.width = '100%';
    loaderOverlay.style.height = '100%';
    loaderOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.justifyContent = 'center';
    loaderOverlay.style.alignItems = 'center';
    loaderOverlay.style.zIndex = '9999';
    
    // Create a circular progress indicator
    const loader = document.createElement('div');
    loader.style.width = '100px';
    loader.style.height = '100px';
    loader.style.border = '10px solid #f3f3f3';
    loader.style.borderTop = '10px solid #3498db';
    loader.style.borderRadius = '50%';
    loader.style.animation = 'spin 1s linear infinite';
    
    // Add spin keyframes
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // Append loader to overlay
    loaderOverlay.appendChild(loader);
    
    // Add overlay to body
    document.body.appendChild(loaderOverlay);
  
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.syncContacts, {
        headers: {
          'X-tenant-id': `${tenantId}` // Replace with the actual tenant ID value
        }
      });
      
      // Remove loader after request completes
      document.body.removeChild(loaderOverlay);
      
      enqueueSnackbar(`Contacts synced at: ${response.data.lastSynced}`, { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
      
      // Refresh the page after successful sync
      window.location.reload();
    } catch (err) {
      // Remove loader in case of error
      document.body.removeChild(loaderOverlay);
      
      enqueueSnackbar('Failed to sync contacts', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    }
  };

  // Add new member
  const handleAddMember = async () => {
    try {
      const newMember = {
        name: 'New Member',
        email: 'new.member@company.com',
        groupId: groups[selectedGroupIndex].id,
        role: 'member'
      };

      const response = await axios.post(API_ENDPOINTS.addMember, newMember);
      
      const updatedGroups = [...groups];
      updatedGroups[selectedGroupIndex].members.push(response.data);
      setGroups(updatedGroups);
      
      enqueueSnackbar('Member added successfully!', { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 2000,
      });
    } catch (err) {
      enqueueSnackbar('Failed to add new member', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    }
  };

  // Filtered and sorted members
  const filteredMembers = useMemo(() => {
    if (!groups || !groups.length) return [];
    
    const currentGroup = groups[selectedGroupIndex] || groups[0];
    const groupMembers = currentGroup.members || [];
    
    return groupMembers
      .filter(member => {
        if (!member || !searchTerm) return true;
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (member.name && member.name.toLowerCase().includes(lowerSearchTerm)) ||
          (member.email && member.email.toLowerCase().includes(lowerSearchTerm))
        );
      })
      .sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return (a.name || '').localeCompare(b.name || '');
      })
      .map(member => ({
        ...member,
        id: member.id // Explicitly preserve the original ID
      }));
  }, [groups, selectedGroupIndex, searchTerm]);

  // Removed duplicate loading/error handling code
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error || !groups.length) {
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
              <IconButton color="primary" onClick={handleSyncContacts}>
                <SyncIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'No groups found. Please check your connection or contact support.'}
        </Alert>
      </Box>
    );
  }

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
            <IconButton color="primary" onClick={handleSyncContacts}>
              <SyncIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New Member">
            <IconButton color="secondary" onClick={handleAddMember}>
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
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {groups.map((group, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {group.name}
               
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
                  {console.log(member,"yahandekhhh")}
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
                 {console.log(member,"yahandekh")}
                <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<MessageIcon />}
               
                onClick={() => handleSendMessage(member.id, member.name)}
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
const Contacts = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      iconVariant={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <MessageIcon />,
      }}
      style={{
        '& .SnackbarItem-message': {
          fontSize: '1rem',
        },
        '& .SnackbarItem-action': {
          marginRight: 0,
        }
      }}
    >
      <ContactsComponent />
    </SnackbarProvider>
  );
};

export default Contacts;