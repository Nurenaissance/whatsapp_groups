import React, { useState } from 'react';
import { Typography, TextField, Button, Card, CardContent, CardActions, IconButton, Grid, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: "Group A", members: 25, image: "groupA.jpg" },
    { id: 2, name: "Group B", members: 15, image: "groupB.jpg" },
  ]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState(["", ""]); // Initially having two phone numbers
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isContactError, setIsContactError] = useState(false); // For contact validation error
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    // Validate that at least two valid phone numbers are provided
    const validPhoneRegex = /^[\+]*[0-9]{10,15}$/; // Basic regex for phone numbers (adjust for your region)

    const validContacts = newGroupMembers.filter((num) => validPhoneRegex.test(num));

    if (validContacts.length >= 2) {
      setGroups([...groups, { id: Date.now(), name: newGroupName, members: newGroupMembers, image: "default.jpg" }]);
      setNewGroupName("");
      setNewGroupMembers(["", ""]); // Reset the members to 2 input fields
      setIsContactError(false);
    } else {
      setIsContactError(true);
    }
  };

  const handleDeleteGroup = (group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = () => {
    setGroups(groups.filter(g => g.id !== selectedGroup.id));
    setDeleteDialogOpen(false);
    setSelectedGroup(null);
  };

  const handleManageGroup = (group) => {
    navigate(`/group/${group.id}`);
  };

  // Function to handle adding a new phone number input
  const handleAddPhoneNumber = () => {
    setNewGroupMembers([...newGroupMembers, ""]); // Add a new empty phone number input
  };

  // Function to handle removing a phone number input
  const handleRemovePhoneNumber = (index) => {
    const updatedMembers = newGroupMembers.filter((_, i) => i !== index);
    setNewGroupMembers(updatedMembers);
  };

  // Function to handle changing the value of a phone number
  const handlePhoneNumberChange = (index, value) => {
    const updatedMembers = [...newGroupMembers];
    updatedMembers[index] = value;
    setNewGroupMembers(updatedMembers);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Groups
      </Typography>

      <TextField
        label="Create New Group"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Typography variant="body1">Add at least 2 phone numbers:</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {newGroupMembers.map((phoneNumber, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={`Phone Number ${index + 1}`}
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              fullWidth
            />
            {newGroupMembers.length > 2 && (
              <IconButton
                color="secondary"
                onClick={() => handleRemovePhoneNumber(index)}
                sx={{ ml: 1, mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        ))}
      </Grid>

      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddPhoneNumber}
        sx={{ mb: 2 }}
      >
        + Add Another Phone Number
      </Button>

      {isContactError && (
        <Typography color="error">Please enter at least two valid phone numbers.</Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleCreateGroup}>
        Create Group
      </Button>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card>
              <CardContent>
                <img src={group.image} alt={group.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                <Typography variant="h6" sx={{ mt: 2 }}>{group.name}</Typography>
                <Typography variant="body2">{group.members.length} Members</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleManageGroup(group)} color="primary">Manage Group</Button>
                <IconButton onClick={() => handleDeleteGroup(group)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this group?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteGroup} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Groups;
