import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { FiberManualRecord as FiberManualRecordIcon } from '@mui/icons-material';
import TopicCloud from './topiccloud';
import DataService from './DataService';

const Dashboard = () => {
  const theme = useTheme();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [allData, setAllData] = useState({
    groups: [],
    dashboardData: {}  // Will store data for all groups
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all groups and their corresponding data in one request
        const groups = await DataService.getAvailableGroups();
        if (groups.length === 0) {
          throw new Error('No groups available');
        }

        // Fetch dashboard data for all groups at once
        const allGroupsData = await DataService.getAllGroupsDashboardData();
        
        setAllData({
          groups,
          dashboardData: allGroupsData
        });

        // Set initial selected group
        setSelectedGroup(groups[0]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array - only runs once

  // Get current group's data
  const getCurrentGroupData = () => {
    if (!selectedGroup || !allData.dashboardData[selectedGroup]) {
      return {
        sentimentData: [],
        engagementData: [],
        topicsData: []
      };
    }

    return allData.dashboardData[selectedGroup];
  };

  const currentData = getCurrentGroupData();
  
  // Derived metrics for quick overview
  const totalMessages = currentData.topicsData?.reduce((sum, topic) => sum + topic.frequency, 0) || 0;
  const activeMembers = currentData.engagementData?.find(item => item.metric === 'Active Members')?.score || 0;

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Group Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Group</InputLabel>
            <Select
              value={selectedGroup}
              label="Select Group"
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {allData.groups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Quick Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 200,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography variant="h6">Total Messages</Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              {totalMessages}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 200,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography variant="h6">Active Members</Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              {activeMembers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 200,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography variant="h6">Sentiment Ratio</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>
                Positive: {currentData.sentimentData?.find(d => d.day === 'Friday')?.Positive || 0}%
              </Typography>
              <Typography>
                Negative: {currentData.sentimentData?.find(d => d.day === 'Friday')?.Negative || 0}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sentiment Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: 400,
              backgroundColor: theme.palette.background.paper 
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Sentiment Trend</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={currentData.sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Positive" stroke={theme.palette.success.main} />
                <Line type="monotone" dataKey="Neutral" stroke={theme.palette.info.main} />
                <Line type="monotone" dataKey="Negative" stroke={theme.palette.error.main} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Topics Cloud */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: 400,
              backgroundColor: theme.palette.background.paper 
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Top Discussion Topics</Typography>
            <TopicCloud 
              topics={currentData.topicsData?.map(t => ({ 
                value: t.topic, 
                count: t.frequency 
              })) || []} 
            />
          </Paper>
        </Grid>

        {/* Engagement Metrics */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mt: 3,
              backgroundColor: theme.palette.background.paper 
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>Engagement Metrics</Typography>
            <Grid container spacing={3}>
              {currentData.engagementData?.map((metric) => (
                <Grid item xs={12} md={4} key={metric.metric}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.action.hover
                    }}
                  >
                    <Typography variant="subtitle1">{metric.metric}</Typography>
                    <Typography 
                      variant="h5" 
                      color={
                        metric.score > 80 
                          ? theme.palette.success.main 
                          : metric.score > 60 
                          ? theme.palette.warning.main 
                          : theme.palette.error.main
                      }
                    >
                      {metric.score}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Additional Insights Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mt: 3,
              backgroundColor: theme.palette.background.paper 
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>Additional Insights</Typography>
            <Grid container spacing={3}>
              {/* Detailed Topic Breakdown */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Topic Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.topicsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="frequency" 
                      fill={theme.palette.primary.main}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>

              {/* Recent Activity Summary */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Recent Activity Summary
                </Typography>
                <List>
                  {[
                    { 
                      primary: "Product Updates Discussion", 
                      secondary: "Increased by 15% this week",
                      color: theme.palette.success.light
                    },
                    { 
                      primary: "Customer Support Tickets", 
                      secondary: "Resolved 85% within 24 hours",
                      color: theme.palette.info.light
                    },
                    { 
                      primary: "Community Engagement", 
                      secondary: "Average response time: 2 hours",
                      color: theme.palette.warning.light
                    }
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FiberManualRecordIcon sx={{ color: item.color }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.primary} 
                        secondary={item.secondary} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;