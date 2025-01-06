import React, { useState, useEffect } from 'react';
import { 
  Plus as PlusIcon, 
  Trash2 as TrashIcon, 
  Users as UserGroupIcon, 
  X as XIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './api';
const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    members: ['', '']
  });

  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Fetch groups and members on component mount
  useEffect(() => {
    const fetchGroupsAndMembers = async () => {
      try {
        // Fetch groups
        const groupsResponse = await axiosInstance.get('/group_details/get_groups');
        const fetchedGroups = groupsResponse.data.groups.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          members: group.members?.length || 0
        }));

        // Process members for each group
        const membersByGroup = {};
        fetchedGroups.forEach(group => {
          const groupData = groupsResponse.data.groups.find(g => g.id === group.id);
          if (groupData && groupData.members) {
            membersByGroup[group.name] = groupData.members.map(member => member.name);
          }
        });

        setGroups(fetchedGroups);
        setGroupMembers(membersByGroup);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching groups and members:', err);
        setError('Failed to fetch groups');
        setIsLoading(false);
      }
    };

    fetchGroupsAndMembers();
  }, []);

  // Rest of the component remains the same
  const handleAddMember = () => {
    setNewGroup(prev => ({
      ...prev,
      members: [...prev.members, '']
    }));
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...newGroup.members];
    updatedMembers[index] = value;
    setNewGroup(prev => ({
      ...prev,
      members: updatedMembers
    }));
  };

  const handleRemoveMember = (index) => {
    if (newGroup.members.length > 2) {
      const updatedMembers = newGroup.members.filter((_, i) => i !== index);
      setNewGroup(prev => ({
        ...prev,
        members: updatedMembers
      }));
    }
  };

  const handleCreateGroup = () => {
    // Validation
    const validMembers = newGroup.members.filter(member => member.trim() !== '');
    if (!newGroup.name || validMembers.length < 2) {
      alert('Please provide a group name and at least 2 valid members');
      return;
    }

    // TODO: Implement actual backend call to create group
    const newGroupEntry = {
      id: Date.now(),
      name: newGroup.name,
      members: validMembers.length,
      description: newGroup.description
    };

    setGroups(prev => [...prev, newGroupEntry]);
    
    // Reset form
    setNewGroup({ name: '', description: '', members: ['', ''] });
    setIsCreateGroupDialogOpen(false);
  };
 // https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/group_details/delete_group/%7Bgroup_name%7D
  const handleDeleteGroup = async(group) => {
    
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
    await axiosInstance.delete(`/group_details/delete_group/${group.name}`);
  };

  const confirmDeleteGroup = () => {
    // TODO: Implement actual backend call to delete group
    setGroups(prev => prev.filter(g => g.id !== selectedGroup.id));
    setIsDeleteDialogOpen(false);
    setSelectedGroup(null);
  };

  const handleManageGroup = (group) => {
    navigate(`./${group.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-primary">
          <UserGroupIcon className="w-10 h-10 text-primary" /> 
          Groups
        </h1>
        <Button 
          onClick={() => setIsCreateGroupDialogOpen(true)} 
          className="hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="mr-2 w-5 h-5" /> Create Group
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <Card 
            key={group.id} 
            onClick={() => handleManageGroup(group)}
            className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{group.name}</h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {groupMembers[group.name]?.slice(0, 3)?.join(', ') || 'No members'}
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4 text-primary/70" />
                    {group.members} Members
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="hover:bg-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group);
                  }}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-primary">Create New Group</DialogTitle>
            <DialogDescription>
              Add a new group with at least two members
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Group Name</Label>
              <Input 
                id="name" 
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({...prev, name: e.target.value}))}
                className="col-span-3"
                placeholder="Enter group name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input 
                id="description" 
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({...prev, description: e.target.value}))}
                className="col-span-3"
                placeholder="Optional group description"
              />
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-primary">Members</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddMember}
                  className="hover:bg-accent"
                >
                  <PlusIcon className="mr-2 w-4 h-4" /> Add Member
                </Button>
              </div>

              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {newGroup.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input 
                      placeholder={`Number for Member ${index + 1}`}
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {newGroup.members.length > 2 && (
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleRemoveMember(index)}
                        className="hover:bg-destructive/90"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateGroupDialogOpen(false)}
              className="hover:bg-accent"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup}
              disabled={!newGroup.name || newGroup.members.filter(m => m.trim() !== '').length < 2}
              className="hover:bg-primary/90"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the group "{selectedGroup?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="hover:bg-accent"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteGroup}
              className="hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;