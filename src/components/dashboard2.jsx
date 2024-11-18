import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Divider, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

import TopicCloud from './topiccloud'; 

// Sample sentiment data and trends for different groups
const sentimentData = {
  'Group A': [
    { day: 'Monday', Positive: 40, Neutral: 35, Negative: 15, Commercial: 10 },
    { day: 'Tuesday', Positive: 45, Neutral: 30, Negative: 15, Commercial: 10 },
    { day: 'Wednesday', Positive: 50, Neutral: 25, Negative: 15, Commercial: 10 },
    { day: 'Thursday', Positive: 60, Neutral: 20, Negative: 10, Commercial: 10 },
    { day: 'Friday', Positive: 70, Neutral: 20, Negative: 5, Commercial: 5 },
  ],
  'Group B': [
    { day: 'Monday', Positive: 35, Neutral: 40, Negative: 10, Commercial: 15 },
    { day: 'Tuesday', Positive: 50, Neutral: 25, Negative: 15, Commercial: 10 },
    { day: 'Wednesday', Positive: 60, Neutral: 20, Negative: 10, Commercial: 10 },
    { day: 'Thursday', Positive: 55, Neutral: 25, Negative: 10, Commercial: 10 },
    { day: 'Friday', Positive: 65, Neutral: 15, Negative: 10, Commercial: 10 },
  ],
};

const engagementScoresData = {
  'Group A': [
    { metric: 'Active Members', score: 85 },
    { metric: 'Engagement Rate', score: 75 },
    { metric: 'Response Rate', score: 65 },
  ],
  'Group B': [
    { metric: 'Active Members', score: 90 },
    { metric: 'Engagement Rate', score: 80 },
    { metric: 'Response Rate', score: 70 },
  ],
};

// Topics data for different groups
const topicsData = {
  'Group A': [
    { topic: 'Product Updates', frequency: 100 },
    { topic: 'Customer Support', frequency: 80 },
    { topic: 'Pricing', frequency: 60 },
    { topic: 'Community', frequency: 40 },
    { topic: 'Feedback', frequency: 20 },
  ],
  'Group B': [
    { topic: 'Sales', frequency: 90 },
    { topic: 'Customer Support', frequency: 70 },
    { topic: 'Feedback', frequency: 50 },
    { topic: 'Product Launch', frequency: 30 },
    { topic: 'Technical Issues', frequency: 10 },
  ],
};

const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState('Group A');
  const [groupSentimentData, setGroupSentimentData] = useState([]);
  const [groupEngagementScores, setGroupEngagementScores] = useState([]);
  const [groupTopics, setGroupTopics] = useState([]);
  const topics = [
    { value: 'Product Updates', count: 100 },
    { value: 'Customer Support', count: 80 },
    { value: 'Pricing', count: 60 },
    { value: 'Community', count: 40 },
    { value: 'Feedback', count: 20 },
  ];

  // Handle the group change
  useEffect(() => {
    setGroupSentimentData(sentimentData[selectedGroup]);
    setGroupEngagementScores(engagementScoresData[selectedGroup]);
    setGroupTopics(topicsData[selectedGroup]);
  }, [selectedGroup]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 4, backgroundColor: '#f5f5f5' }}>
      {/* Group Selection Dropdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Select Group</Typography>
        <Select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="Group A">Group A</MenuItem>
          <MenuItem value="Group B">Group B</MenuItem>
        </Select>
      </Box>

      {/* Group Stats Section */}
      <Typography variant="h4" gutterBottom>Group Sentiment Dashboard</Typography>
      <Divider sx={{ margin: '20px 0' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Card sx={{ width: '30%', backgroundColor: '#ffffff', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Total Messages</Typography>
            <Typography variant="body1">{groupTopics.reduce((acc, topic) => acc + topic.frequency, 0)}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '30%', backgroundColor: '#ffffff', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Active Members</Typography>
            <Typography variant="body1">{groupEngagementScores[0]?.score}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '30%', backgroundColor: '#ffffff', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Top Contributors</Typography>
            <Typography variant="body1">John Doe, Jane Smith</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Sentiment Trend Over Time */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Sentiment Trend Over Time</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={groupSentimentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Positive" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Neutral" stroke="#8884d8" />
            <Line type="monotone" dataKey="Negative" stroke="#FF8042" />
            <Line type="monotone" dataKey="Commercial" stroke="#FFBB28" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Engagement Line Chart */}
      <Box sx={{ mt: 4 }}>
  <Typography variant="h6">Engagement Over Time</Typography>
  {/* Static Engagement Data for Visualization */}
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={[
      { day: 'Monday', 'Active Members': 85, 'Engagement Rate': 75, 'Response Rate': 65 },
      { day: 'Tuesday', 'Active Members': 90, 'Engagement Rate': 80, 'Response Rate': 70 },
      { day: 'Wednesday', 'Active Members': 88, 'Engagement Rate': 77, 'Response Rate': 68 },
      { day: 'Thursday', 'Active Members': 92, 'Engagement Rate': 82, 'Response Rate': 75 },
      { day: 'Friday', 'Active Members': 95, 'Engagement Rate': 85, 'Response Rate': 78 },
    ]}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="Active Members" stroke="#82ca9d" />
      <Line type="monotone" dataKey="Engagement Rate" stroke="#8884d8" />
      <Line type="monotone" dataKey="Response Rate" stroke="#FF8042" />
    </LineChart>
  </ResponsiveContainer>
</Box>

{/* Topic Representation */}
<Box sx={{ mt: 4, px: 2, py: 4, backgroundColor: '#f4f4f9', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
        Topics Discussed Over the Week
      </Typography>

      {/* Render the TopicCloud component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <TopicCloud topics={topics} />
      </Box>
    </Box>



    </Box>
  );
};

export default Dashboard;
