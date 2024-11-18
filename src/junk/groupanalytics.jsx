import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const GroupAnalytics = () => {
  const { groupId } = useParams();

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Analytics for Group ID: {groupId}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {/* Replace with actual analytics data */}
        Here is the analytics data for the selected group. You can include metrics like number of members, recent activity, engagement rate, etc.
      </Typography>
    </Box>
  );
};

export default GroupAnalytics;
