import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { Tooltip } from '@mui/material';

const colorPalette = [
  '#1E90FF', '#FF6347', '#32CD32', 
  '#FFD700', '#8A2BE2', '#FF4500', '#4682B4'
];

const TopicCloud = ({ topics }) => {
  console.log('TopicCloud received topics:', topics);

  // More robust checking
  if (!topics) {
    console.warn('No topics provided to TopicCloud');
    return null;
  }

  if (!Array.isArray(topics)) {
    console.warn('Topics is not an array:', topics);
    return null;
  }

  // Ensure each topic has the required properties
  const validTopics = topics.filter(tag => 
    tag && 
    typeof tag.value === 'string' && 
    tag.value.trim() !== '' && 
    typeof tag.count === 'number'
  );

  console.log('Valid topics:', validTopics);

  if (validTopics.length === 0) {
    console.warn('No valid topics to display');
    return null;
  }

  return (
    <TagCloud
      minSize={16}
      maxSize={50}
      tags={validTopics}
      colorOptions={{ luminosity: 'light', hue: 'blue' }}
      renderer={(tag, size) => {
        if (!tag || !tag.value) return null;
        
        const colorIndex = Math.abs(tag.value.length) % colorPalette.length;
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