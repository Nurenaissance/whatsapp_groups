// TopicCloud.jsx
import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { Tooltip } from '@mui/material';

const TopicCloud = ({ topics }) => {
  return (
    <TagCloud
      minSize={16}
      maxSize={50}
      tags={topics}
      colorOptions={{ luminosity: 'light', hue: 'blue' }}
      renderer={(tag, size, color) => (
        <Tooltip title={`Frequency: ${tag.count}`} arrow>
          <span
            key={tag.value}
            style={{
              fontSize: size,
              color: color,
              margin: '5px',
              padding: '5px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light background for better contrast
              border: `1px solid ${color}`, // Border to differentiate topics
              transition: 'transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
              ':hover': {
                transform: 'scale(1.2)',
                backgroundColor: color, // Change background on hover for emphasis
                borderColor: '#ffffff', // Highlight border on hover
              },
            }}
          >
            {tag.value}
          </span>
        </Tooltip>
      )}
    />
  );
};

export default TopicCloud;
