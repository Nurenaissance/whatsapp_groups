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

// Placeholder for your topic cloud component
import TopicCloud from './topiccloud';

// Centralized data management with easy endpoint replacement
const DataService = {
  // Replace these with your actual API endpoints
  getSentimentData: (group) => {
    const sentimentData = {
      'Group A': [
        { day: 'Monday', Positive: 40, Neutral: 35, Negative: 15, Commercial: 10 },
        { day: 'Tuesday', Positive: 45, Neutral: 30, Negative: 15, Commercial: 10 },
        { day: 'Wednesday', Positive: 35, Neutral: 40, Negative: 15, Commercial: 10 },
        { day: 'Thursday', Positive: 50, Neutral: 25, Negative: 15, Commercial: 10 },
        { day: 'Friday', Positive: 55, Neutral: 20, Negative: 15, Commercial: 10 }
      ],
      'Group B': [
        { day: 'Monday', Positive: 35, Neutral: 40, Negative: 10, Commercial: 15 },
        { day: 'Tuesday', Positive: 40, Neutral: 35, Negative: 10, Commercial: 15 },
        { day: 'Wednesday', Positive: 30, Neutral: 45, Negative: 10, Commercial: 15 },
        { day: 'Thursday', Positive: 45, Neutral: 30, Negative: 10, Commercial: 15 },
        { day: 'Friday', Positive: 50, Neutral: 25, Negative: 10, Commercial: 15 }
      ]
    };
    return Promise.resolve(sentimentData[group]);
  },

  getEngagementData: (group) => {
    const engagementData = {
      'Group A': [
        { metric: 'Active Members', score: 85 },
        { metric: 'Engagement Rate', score: 75 },
        { metric: 'Response Rate', score: 65 },
      ],
      'Group B': [
        { metric: 'Active Members', score: 90 },
        { metric: 'Engagement Rate', score: 80 },
        { metric: 'Response Rate', score: 70 },
      ]
    };
    return Promise.resolve(engagementData[group]);
  },

  getTopicsData: (group) => {
    const topicsData = {
      'Group A': [
        { topic: 'Product Updates', frequency: 100 },
        { topic: 'Customer Support', frequency: 80 },
        { topic: 'Marketing', frequency: 60 },
        { topic: 'Sales', frequency: 40 }
      ],
      'Group B': [
        { topic: 'Sales', frequency: 90 },
        { topic: 'Customer Support', frequency: 70 },
        { topic: 'Product Development', frequency: 50 },
        { topic: 'Marketing', frequency: 45 }
      ]
    };
    return Promise.resolve(topicsData[group]);
  }
};

const Dashboard = () => {
  const theme = useTheme();
  const [selectedGroup, setSelectedGroup] = useState('Group A');
  const [sentimentData, setSentimentData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sentiment, engagement, topics] = await Promise.all([
          DataService.getSentimentData(selectedGroup),
          DataService.getEngagementData(selectedGroup),
          DataService.getTopicsData(selectedGroup)
        ]);

        setSentimentData(sentiment);
        setEngagementData(engagement);
        setTopicsData(topics);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGroup]);

  // Derived metrics for quick overview
  const totalMessages = topicsData.reduce((sum, topic) => sum + topic.frequency, 0);
  const activeMembers = engagementData.find(item => item.metric === 'Active Members')?.score || 0;

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
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
              <MenuItem value="Group A">Group A</MenuItem>
              <MenuItem value="Group B">Group B</MenuItem>
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
              <Typography>Positive: {sentimentData.find(d => d.day === 'Friday')?.Positive || 0}%</Typography>
              <Typography>Negative: {sentimentData.find(d => d.day === 'Friday')?.Negative || 0}%</Typography>
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
              <LineChart data={sentimentData}>
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
              topics={topicsData.map(t => ({ 
                value: t.topic, 
                count: t.frequency 
              }))} 
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
              {engagementData.map((metric) => (
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
                  <BarChart data={topicsData}>
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
                        <FiberManualRecordIcon 
                          sx={{ color: item.color }} 
                        />
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