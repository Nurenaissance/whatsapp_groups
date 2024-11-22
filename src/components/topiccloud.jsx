import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { Tooltip } from '@mui/material';

// Define a minimalist color palette with good contrast
const colorPalette = [
  '#1E90FF', // Dodger Blue - Bright and professional
  '#FF6347', // Tomato Red - Attention-grabbing but not too aggressive
  '#32CD32', // Lime Green - Balanced and pleasant
  '#FFD700', // Gold - Warm and stands out on a neutral background
  '#8A2BE2', // BlueViolet - Calm and visually interesting
  '#FF4500', // OrangeRed - Subtle yet strong
  '#4682B4', // SteelBlue - Understated and professional
];

const TopicCloud = ({ topics }) => {
  // Return null if topics is null/undefined or empty array
  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return null;
  }

  // Helper function to safely get color index
  const getColorIndex = (value) => {
    if (!value) return 0;
    const stringValue = String(value);
    return stringValue.length % colorPalette.length;
  };

  return (
    <TagCloud
      minSize={16}
      maxSize={50}
      tags={topics.filter(tag => tag && tag.value)} // Filter out invalid tags
      colorOptions={{ luminosity: 'light', hue: 'blue' }}
      renderer={(tag, size) => {
        if (!tag || !tag.value) return null;
        
        const colorIndex = getColorIndex(tag.value);
        const color = colorPalette[colorIndex];
        
        return (
          <Tooltip 
            key={tag.value} 
            title={`Frequency: ${tag.count || 0}`} 
            arrow
          >
            <span
              style={{
                fontSize: size,
                color: color,
                margin: '5px',
                padding: '5px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${color}`,
                transition: 'transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
              }}
            >
              {tag.value}
            </span>
          </Tooltip>
        );
      }}
    />
  );
};

export default TopicCloud;