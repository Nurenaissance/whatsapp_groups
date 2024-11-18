import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Group Name</Typography>
      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search messages"
        />
        <Box ml={2} display="flex" alignItems="center">
          <FaSearch />
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
