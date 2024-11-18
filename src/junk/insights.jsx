import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

function Insights() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Insights
      </Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Group Engagement Insights
          </Typography>
          <Typography variant="body2">
            See detailed analytics on group engagement, including message activity, reactions, and member participation.
          </Typography>
        </CardContent>
      </Card>

      {/* Add more insights here */}
    </Box>
  );
}

export default Insights;
