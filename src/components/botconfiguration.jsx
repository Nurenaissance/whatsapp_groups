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
import { Trash2, PlusCircle } from "lucide-react";

const BotConfiguration = () => {
  const [bots, setBots] = useState([]);
  const [selectedBotIndex, setSelectedBotIndex] = useState(0);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bots from endpoint
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch('https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/bot_details/get_bot_config');
        if (!response.ok) {
          throw new Error('Failed to fetch bot configurations');
        }
        const data = await response.json();
        setBots(data.bots.map((bot, index) => ({
          ...bot,
          logs: bot.logs.map(log => ({
            ...log,
            id: crypto.randomUUID(),
            user: log.phone_or_name,
            action: log.action || 'No action'
          }))
        })));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBots();
  }, []);

  // Helper function to get currently selected bot
  const getCurrentBot = () => {
    return bots[selectedBotIndex];
  };

  const handleAddBot = () => {
    const newBot = {
      name: `Bot ${bots.length + 1}`,
      isBotEnabled: true,
      spamKeywords: [],
      messageLimit: 3,
      replyMessage: "",
      spamAction: "Warn",
      logs: []
    };
    setBots([...bots, newBot]);
    setSelectedBotIndex(bots.length);
  };

  const handleDeleteBot = (index) => {
    const updatedBots = bots.filter((_, idx) => idx !== index);
    setBots(updatedBots);
    setSelectedBotIndex(Math.min(selectedBotIndex, updatedBots.length - 1));
  };

  const updateCurrentBot = (updates) => {
    setBots(prevBots => 
      prevBots.map((bot, index) => 
        index === selectedBotIndex 
          ? { ...bot, ...updates } 
          : bot
      )
    );
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
  if (!bots.length) return <div>No bots found</div>;

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
            <Select 
              value={selectedBotIndex.toString()} 
              onValueChange={(value) => setSelectedBotIndex(Number(value))}
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
            <Button onClick={handleAddBot} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bot
            </Button>
            {bots.length > 1 && (
              <Button 
                onClick={() => handleDeleteBot(selectedBotIndex)} 
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Bot
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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

          <div className="flex items-center space-x-4">
            <Label>Max Messages per Minute</Label>
            <Input 
              type="number" 
              value={currentBot.messageLimit} 
              onChange={(e) => updateCurrentBot({ messageLimit: Number(e.target.value) })}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spam Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label>Reply Message</Label>
            <Textarea
              value={currentBot.replyMessage || ''}
              onChange={(e) => updateCurrentBot({ replyMessage: e.target.value })}
              placeholder="Enter reply message for spam detection"
            />
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default BotConfiguration;