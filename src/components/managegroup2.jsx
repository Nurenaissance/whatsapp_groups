import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Importing from Recharts

const ManageGroup = () => {
  const { id } = useParams();  // Get the group ID from the URL parameter
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch group data on mount
  useEffect(() => {
    // Simulating data fetch with a timeout (you can replace with API call)
    setTimeout(() => {
      setGroupData({
        name: `Group ${id}`,
        memberCount: 56,
        recentMessages: 1200,
        activeMembers: 45,
        topMember: 'John Doe',
        activityTrend: [
          { day: 'Mon', messages: 20 },
          { day: 'Tue', messages: 30 },
          { day: 'Wed', messages: 50 },
          { day: 'Thu', messages: 75 },
          { day: 'Fri', messages: 60 },
          { day: 'Sat', messages: 85 },
          { day: 'Sun', messages: 120 }
        ], // Example trend data
        recentActivity: [
          { date: '2024-11-18', messages: 20 },
          { date: '2024-11-17', messages: 15 },
        ],
      });
      setLoading(false);
    }, 1500);  // Simulating loading time
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f4f4f9', p: 3, mt: 8 }}>
      <Grid container spacing={3}>
        {/* Group Overview Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {groupData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Members: {groupData.memberCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Members: {groupData.activeMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top Member: {groupData.topMember}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Trend Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Weekly Activity Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={groupData.activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="messages" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              {groupData.recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {activity.date}: {activity.messages} messages
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageGroup;
