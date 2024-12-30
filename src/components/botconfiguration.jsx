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
import axiosInstance from './api';

const EMPTY_BOT = {
  id: '',
  name: '',
  isBotEnabled: true,
  spamKeywordsActions: {},
  messageLimit: 3,
  replyMessage: '',
  aidetection: false,
  aireply: false,
  aiSpamActionPrompt: '',
};

const SPAM_ACTIONS = [
  { value: 'block', label: 'Block User' },
  { value: 'remove', label: 'Remove User' },
  { value: 'delete', label: 'Delete Message' }
];

const BotConfiguration = () => {
  const [bots, setBots] = useState([]);
  const [selectedBotIndex, setSelectedBotIndex] = useState(0);
  const [newKeyword, setNewKeyword] = useState('');
  const [newKeywordAction, setNewKeywordAction] = useState('delete');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newBotData, setNewBotData] = useState(EMPTY_BOT);

  const fetchBots = async () => {
    try {
      const response = await axiosInstance.get('/bot_details/get_bot_config');
      
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
      setBots([]);
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const getCurrentBot = () => {
    if (isCreatingNew) {
      return {
        ...EMPTY_BOT,
        ...newBotData
      };
    }
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
    if (!newBotData.name || newBotData.name.trim() === '') {
      setError('Bot name is required');
      return;
    }
  
    const newBotPayload = {
      name: newBotData.name,
      isBotEnabled: newBotData.isBotEnabled,
      spamKeywordsActions: newBotData.spamKeywordsActions,
      messageLimit: newBotData.messageLimit,
      replyMessage: newBotData.replyMessage,
      aidetection: newBotData.aidetection,
      aireply: newBotData.aireply,
      aiSpamActionPrompt: newBotData.aiSpamActionPrompt
    };
  
    setIsSaving(true);
    try {
      await axiosInstance.post('/bot_details/add_bot_config', newBotPayload);
      await fetchBots();
      setIsCreatingNew(false);
      setNewBotData(EMPTY_BOT);
      setSelectedBotIndex(bots.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBot = async (botId) => {
    if (!botId) {
      setError('Cannot delete bot: Invalid bot ID');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to delete this bot?');
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/bot_details/delete_bot_config/${botId}`);
      await fetchBots();
      setError(null);
      setSelectedBotIndex(prevIndex => Math.max(0, Math.min(prevIndex, bots.length - 2)));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete bot';
      setError(errorMessage);
      console.error('Delete bot error:', err);
    }
  };

  const handleSaveBot = async () => {
    const currentBot = getCurrentBot();
    
    if (!currentBot.name || currentBot.name.trim() === '') {
      setError('Bot name is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: currentBot.id,
        name: currentBot.name,
        isBotEnabled: currentBot.isBotEnabled,
        spamKeywordsActions: currentBot.spamKeywordsActions,
        messageLimit: currentBot.messageLimit,
        replyMessage: currentBot.replyMessage,
        aidetection: currentBot.aidetection,
        aireply: currentBot.aireply,
        aiSpamActionPrompt: currentBot.aiSpamActionPrompt
      };

      await axiosInstance.put(`/bot_details/update_bot_config/${currentBot.id}`, payload);
      setError(null);
      await fetchBots();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update bot';
      setError(errorMessage);
      console.error('Update bot error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateCurrentBot = (updates) => {
    if (isCreatingNew) {
      setNewBotData(prev => ({ ...prev, ...updates }));
    } else {
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
    if (newKeyword && !currentBot.spamKeywordsActions[newKeyword]) {
      updateCurrentBot({
        spamKeywordsActions: {
          ...currentBot.spamKeywordsActions,
          [newKeyword]: newKeywordAction
        }
      });
      setNewKeyword('');
      setNewKeywordAction('remove');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    const currentBot = getCurrentBot();
    const updatedKeywords = { ...currentBot.spamKeywordsActions };
    delete updatedKeywords[keyword];
    updateCurrentBot({ spamKeywordsActions: updatedKeywords });
  };

  const handleUpdateKeywordAction = (keyword, action) => {
    const currentBot = getCurrentBot();
    updateCurrentBot({
      spamKeywordsActions: {
        ...currentBot.spamKeywordsActions,
        [keyword]: action
      }
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
                    onClick={() => handleDeleteBot(currentBot.id)} 
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
          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Bot Name</Label>
                <Input 
                  value={currentBot.name} 
                  onChange={(e) => updateCurrentBot({ name: e.target.value })}
                  placeholder="Enter bot name"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label>Status</Label>
                <Switch 
                  checked={currentBot.isBotEnabled}
                  onCheckedChange={(checked) => updateCurrentBot({ isBotEnabled: checked })}
                />
                <span>{currentBot.isBotEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spam Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>AI-Powered Spam Detection</Label>
                <Switch 
                  checked={currentBot.aidetection}
                  onCheckedChange={(checked) => updateCurrentBot({ aidetection: checked })}
                />
                <span>{currentBot.aidetection ? 'Enabled' : 'Disabled'}</span>
              </div>

              <div className="flex space-x-2">
                <Input 
                  placeholder="Add spam keyword" 
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Select 
                  value={newKeywordAction}
                  onValueChange={setNewKeywordAction}
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
                <Button onClick={handleAddKeyword}>Add Keyword</Button>
              </div>

              <div className="space-y-2">
                {Object.entries(currentBot.spamKeywordsActions || {}).map(([keyword, action]) => (
                  <div key={keyword} className="flex items-center space-x-2">
                    <Badge variant="secondary" className="px-2 py-1">
                      {keyword}
                    </Badge>
                    <Select 
                      value={action}
                      onValueChange={(newAction) => handleUpdateKeywordAction(keyword, newAction)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPAM_ACTIONS.map((spamAction) => (
                          <SelectItem key={spamAction.value} value={spamAction.value}>
                            {spamAction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {currentBot.aidetection && (
                <div className="mt-4 text-sm text-muted-foreground">
                  AI Spam Detection will use advanced language understanding to detect spam 
                  beyond exact keyword matches.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spam Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>AI-Powered Response</Label>
                <Switch 
                  checked={currentBot.aireply}
                  onCheckedChange={(checked) => updateCurrentBot({ aireply: checked })}
                />
                <span>{currentBot.aireply ? 'Enabled' : 'Disabled'}</span>
              </div>

              <div className="space-y-2">
                <Label>Reply Message</Label>
                <Textarea
                  value={currentBot.replyMessage || ''}
                  onChange={(e) => updateCurrentBot({ replyMessage: e.target.value })}
                  placeholder="Enter default reply message for spam detection"
                />
                <div className="text-sm text-muted-foreground">
                  This message will be used when a specific action is set to "Reply"
                </div>
              </div>

              {currentBot.aireply && (
                <div className="space-y-2">
                  <Label>AI Response Prompt</Label>
                  <Textarea
                    value={currentBot.aiSpamActionPrompt || ''}
                    onChange={(e) => updateCurrentBot({ aiSpamActionPrompt: e.target.value })}
                    placeholder="Describe how the AI should handle spam messages (e.g., 'Respond with a polite warning that escalates based on repeat offenses')"
                  />
                  <div className="text-sm text-muted-foreground">
                    When AI Response is enabled, the bot will use this prompt to dynamically 
                    generate responses based on the context and severity of spam.
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Label>Message Limit</Label>
                <Input 
                  type="number"
                  value={currentBot.messageLimit}
                  onChange={(e) => updateCurrentBot({ messageLimit: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  Maximum number of messages before triggering spam detection
                </span>
              </div>
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
                    {currentBot.logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.action}</TableCell>
                      </TableRow>
                    ))}
                    {(!currentBot.logs || currentBot.logs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No logs available
                        </TableCell>
                      </TableRow>
                    )}
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