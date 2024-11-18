import React from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';

const GroupListing = ({ phoneNumber = "1234567890" }) => {
  // Sample group data fetched after attaching the phone number
  const groups = [
    { id: 1, name: 'Group A', description: 'Description of Group A' },
    { id: 2, name: 'Group B', description: 'Description of Group B' },
    { id: 3, name: 'Group C', description: 'Description of Group C' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Groups for Phone Number: {phoneNumber}
      </Typography>
      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{group.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {group.description}
                </Typography>
                <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                  Manage Group
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default GroupListing;
