import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MediaPreview = ({ media, caption, messageType, messageContent }) => {
  const renderMedia = () => {
    if (messageType === 'image' && media) {
      return (
        <Box sx={{
          width: '100%',
          maxWidth: 350, // Restrict image size for WhatsApp-like preview
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '8px',
        }}>
          <img
            src={URL.createObjectURL(media)}
            alt="Image Preview"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              objectFit: 'cover', // Ensure image covers the container well
            }}
          />
        </Box>
      );
    } else if (messageType === 'video' && media) {
      return (
        <Box sx={{
          width: '100%',
          maxWidth: 350,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '8px',
        }}>
          <video
            width="100%"
            controls
            style={{ borderRadius: '16px' }}
          >
            <source src={URL.createObjectURL(media)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    } else if (messageType === 'text' && messageContent) {
      return (
        <Box sx={{
          padding: '8px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          maxWidth: '350px',
          marginBottom: '8px',
        }}>
          <Typography variant="body2" sx={{ color: '#4f4f4f', fontSize: '14px' }}>
            {messageContent}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{
      maxWidth: 400,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      borderRadius: '16px',
      marginBottom: '16px',
      backgroundColor: '#f8f8f8', // WhatsApp-like light background
      padding: '10px',
    }}>
      <CardContent sx={{ padding: 0 }}>
        <Box sx={{ marginBottom: '8px' }}>
          {renderMedia()}
        </Box>
        {/* Only show caption if message type is 'image' or 'video' */}
        {((messageType === 'image' || messageType === 'video') && caption) && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              marginTop: '8px',
              fontSize: '14px',
              lineHeight: '1.2',
              color: '#4f4f4f', // Slight gray color for caption
            }}
          >
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaPreview;
