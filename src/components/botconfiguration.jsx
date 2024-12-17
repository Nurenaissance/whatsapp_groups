import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trash2, PlusCircle, Save, X } from "lucide-react";

const API_BASE_URL = 'https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net';

const EMPTY_BOT = {
  id: '',
  name: '',
  isBotEnabled: true,
  spamKeywords: [],
  messageLimit: 3,
  replyMessage: '',
  spamAction: 'Reply',
  aiSpamDetection: false,
  aiSpamActionEnabled: false,
  aiSpamActionPrompt: '',
};
import axiosInstance from './api';
const SPAM_ACTIONS = [
  { value: 'Reply', label: 'Reply with Message' },
  { value: 'Delete', label: 'Delete Message' }
];

const BotConfiguration = () => {
  const [bots, setBots] = useState([]);
  const [selectedBotIndex, setSelectedBotIndex] = useState(0);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newBotData, setNewBotData] = useState(EMPTY_BOT);

  // Fetch bots from endpoint
  const fetchBots = async () => {
    try {
      const response = await axiosInstance.get('/bot_details/get_bot_config');
      
      // If no bots are found, response.data might be empty
      if (!response.data || response.data.bots.length === 0) {
        setBots([]);
        setIsLoading(false);
        return;
      }
  
      const processedBots = response.data.bots.map((bot, index) => ({
        ...bot,
        logs: bot.logs.map(log => ({
          ...log,
          id: crypto.randomUUID(),
          user: log.phone_or_name,
          action: log.action || 'No action'
        }))
      }));
  
      setBots(processedBots);
      setIsLoading(false);
    } catch (err) {
      // If there's an error fetching bots, set bots to an empty array
      setBots([]);
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  // Helper function to get currently selected bot
  const getCurrentBot = () => {
    // If creating a new bot and no data exists, return the empty bot template
    if (isCreatingNew) {
      return {
        ...EMPTY_BOT,
        ...newBotData // Merge any existing new bot data
      };
    }
  
    // Otherwise, return the selected bot from the list
    return bots[selectedBotIndex] || EMPTY_BOT;
  };
  const handleStartNewBot = () => {
    setIsCreatingNew(true);
    setNewBotData(EMPTY_BOT);
  };

  const handleCancelNewBot = () => {
    setIsCreatingNew(false);
    setNewBotData(EMPTY_BOT);
  };

  const handleCreateBot = async () => {
    // Validate that the bot name is not empty
    if (!newBotData.name || newBotData.name.trim() === '') {
      setError('Bot name is required');
      return;
    }
  
    // Prepare the bot data, removing any keys with undefined or null values
    const newBotPayload = {
      name: newBotData.name,
      isBotEnabled: newBotData.isBotEnabled,
      spamKeywords: newBotData.spamKeywords,
      messageLimit: newBotData.messageLimit,
      replyMessage: newBotData.replyMessage,
      spamAction: newBotData.spamAction,
      aidetection: newBotData.aiSpamDetection,
      aireply: newBotData.aiSpamActionEnabled,
      aiSpamActionPrompt: newBotData.aiSpamActionPrompt
    };
  
    setIsSaving(true);
    try {
      const response = await axiosInstance.post('/bot_details/add_bot_config/', 
        newBotPayload, // Send directly as an object
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      await fetchBots();
      setIsCreatingNew(false);
      setNewBotData(EMPTY_BOT);
      
      // Set the newly created bot as the selected bot
      setSelectedBotIndex(bots.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

const handleDeleteBot = async (botId) => {
  // Validate botId
  if (!botId) {
    setError('Cannot delete bot: Invalid bot ID');
    return;
  }

  // Confirm deletion
  const isConfirmed = window.confirm('Are you sure you want to delete this bot?');
  
  if (!isConfirmed) return;

  try {
    await axiosInstance.delete(`/bot_details/delete_bot_config/${botId}`);

    // Fetch updated bot list after deletion
    await fetchBots();

    // Reset error state
    setError(null);

    // Adjust selected bot index
    setSelectedBotIndex(prevIndex => {
      // If the deleted bot was the last one, select the previous bot
      // If only one bot remains, select the first bot
      // If no bots remain, return 0
      return Math.max(0, Math.min(prevIndex, bots.length - 2));
    });
  } catch (err) {
    // More detailed error handling
    const errorMessage = err.response?.data?.message || err.message || 'Failed to delete bot';
    setError(errorMessage);
    console.error('Delete bot error:', err);
  }
};

const handleSaveBot = async () => {
  const currentBot = getCurrentBot();
  
  // Validate bot name
  if (!currentBot.name || currentBot.name.trim() === '') {
    setError('Bot name is required');
    return;
  }

  setIsSaving(true);
  try {
    // Prepare payload matching backend expectations
    const payload = {
      id:currentBot.id,
      name: currentBot.name,
      isBotEnabled: currentBot.isBotEnabled,
      spamKeywords: currentBot.spamKeywords,
      messageLimit: currentBot.messageLimit,
      replyMessage: currentBot.replyMessage,
      spamAction: currentBot.spamAction,
      aidetection: currentBot.aiSpamDetection,
      aireply: currentBot.aiSpamActionEnabled,
      aiSpamActionPrompt: currentBot.aiSpamActionPrompt
    };

    // Use axiosInstance for consistency
    await axiosInstance.put(`/bot_details/update_bot_config/${currentBot.id}`, payload);

    // Reset error state
    setError(null);

    // Refresh bots list
    await fetchBots();
  } catch (err) {
    // More detailed error handling
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update bot';
    setError(errorMessage);
    console.error('Update bot error:', err);
  } finally {
    setIsSaving(false);
  }
};
  const updateCurrentBot = (updates) => {
    if (isCreatingNew) {
      // When creating a new bot, always update the newBotData
      setNewBotData(prev => ({ ...prev, ...updates }));
    } else {
      // When editing an existing bot, update the bots array
      setBots(prevBots => 
        prevBots.map((bot, index) => 
          index === selectedBotIndex 
            ? { ...bot, ...updates } 
            : bot
        )
      );
    }
  };
  const handleAddKeyword = () => {
    const currentBot = getCurrentBot();
    if (newKeyword && !currentBot.spamKeywords.includes(newKeyword)) {
      updateCurrentBot({
        spamKeywords: [...currentBot.spamKeywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    updateCurrentBot({
      spamKeywords: getCurrentBot().spamKeywords.filter(k => k !== keyword)
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!bots.length && !isCreatingNew) return (
    <div className="container mx-auto p-6">
      <Button onClick={handleStartNewBot}>Create First Bot</Button>
    </div>
  );

  const currentBot = getCurrentBot();

  return (
    <div className="container mx-auto p-6 space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Manage and configure your AI bots</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            {!isCreatingNew && bots.length > 0 ? (
              <>
                <Select 
  value={selectedBotIndex.toString()} 
  onValueChange={(value) => {
    setSelectedBotIndex(Number(value));
    setIsCreatingNew(false);
  }}
>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bot" />
                  </SelectTrigger>
                  <SelectContent>
                    {bots.map((bot, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {bot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleStartNewBot} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Bot
                </Button>
                {bots.length > 1 && (
                <Button 
                onClick={() => handleDeleteBot(currentBot.id || bots[selectedBotIndex]?.id)} 
                variant="destructive"
                disabled={isSaving}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Bot
              </Button>
                )}
                <Button 
                  onClick={handleSaveBot} 
                  variant="default"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </>
            ) : (
              // Always show create bot options when no bots exist or creating new
              <>
                <span className="text-lg font-semibold">
                  {isCreatingNew ? 'Creating New Bot' : 'No Bots Configured'}
                </span>
                <Button 
                  onClick={isCreatingNew ? handleCreateBot : handleStartNewBot} 
                  variant="default"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  {isCreatingNew ? 'Create Bot' : 'Create First Bot'}
                </Button>
                {isCreatingNew && (
                  <Button 
                    onClick={handleCancelNewBot} 
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

     {(bots.length > 0 || isCreatingNew) && (
        <>
          {/* Existing cards for bot settings, spam detection, etc. */}
          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Bot Name</Label>
                <Input 
                  value={getCurrentBot().name} 
                  onChange={(e) => updateCurrentBot({ name: e.target.value })}
                  placeholder="Enter bot name"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label>Status</Label>
                <Switch 
                  checked={getCurrentBot().isBotEnabled}
                  onCheckedChange={(checked) => updateCurrentBot({ isBotEnabled: checked })}
                />
                <span>{getCurrentBot().isBotEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Other existing cards (Spam Detection, Spam Action, etc.) */}
     

      <Card>
        <CardHeader>
          <CardTitle>Spam Detection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label>AI-Powered Spam Detection</Label>
            <Switch 
              checked={currentBot.aiSpamDetection}
              onCheckedChange={(checked) => updateCurrentBot({ aiSpamDetection: checked })}
            />
            <span>{currentBot.aiSpamDetection ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex space-x-2">
            <Input 
              placeholder="Add spam keyword" 
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button onClick={handleAddKeyword}>Add Keyword</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentBot.spamKeywords.map(keyword => (
              <Badge 
                key={keyword} 
                variant="secondary"
                className="flex items-center"
              >
                {keyword}
                <button 
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-2"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {currentBot.aiSpamDetection && (
            <div className="mt-4 text-sm text-muted-foreground">
              AI Spam Detection will use advanced language understanding to detect spam 
              beyond exact keyword matches.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spam Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label>Spam Action Type</Label>
            <Select 
              value={currentBot.spamAction}
              onValueChange={(value) => updateCurrentBot({ spamAction: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Action" />
              </SelectTrigger>
              <SelectContent>
                {SPAM_ACTIONS.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Label>AI-Powered Spam Action</Label>
            <Switch 
              checked={currentBot.aiSpamActionEnabled}
              onCheckedChange={(checked) => updateCurrentBot({ aiSpamActionEnabled: checked })}
            />
            <span>{currentBot.aiSpamActionEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>

          {currentBot.spamAction === 'Reply' && (
            <div className="flex items-center space-x-4">
              <Label>Reply Message</Label>
              <Textarea
                value={currentBot.replyMessage || ''}
                onChange={(e) => updateCurrentBot({ replyMessage: e.target.value })}
                placeholder="Enter reply message for spam detection"
              />
            </div>
          )}

          {currentBot.aiSpamActionEnabled && (
            <div className="space-y-2">
              <Label>AI Action Prompt</Label>
              <Textarea
                value={currentBot.aiSpamActionPrompt || ''}
                onChange={(e) => updateCurrentBot({ aiSpamActionPrompt: e.target.value })}
                placeholder="Describe how the AI should handle spam messages (e.g., 'Respond with a polite warning that escalates based on repeat offenses')"
              />
              <div className="text-sm text-muted-foreground">
                When AI Spam Action is enabled, the bot will use this prompt to dynamically 
                generate responses or determine actions based on the context and severity of spam.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!isCreatingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Action Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBot.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
         </>
      )}
    </div>
  );
};

export default BotConfiguration;