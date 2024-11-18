import React, { useState } from 'react';
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
  const [bots, setBots] = useState([
    { 
      id: 1, 
      name: "Bot 1", 
      isBotEnabled: true, 
      spamKeywords: [], 
      messageLimit: 3, 
      replyMessage: "", 
      spamAction: "Warn", 
      logs: [] 
    },
  ]);

  const [selectedBotId, setSelectedBotId] = useState(1);
  const [newKeyword, setNewKeyword] = useState('');

  // Helper function to get currently selected bot
  const getCurrentBot = () => {
    return bots.find(bot => bot.id === selectedBotId) || bots[0];
  };

  const handleAddBot = () => {
    const newBot = {
      id: bots.length + 1,
      name: `Bot ${bots.length + 1}`,
      isBotEnabled: true,
      spamKeywords: [],
      messageLimit: 3,
      replyMessage: "",
      spamAction: "Warn",
      logs: []
    };
    setBots([...bots, newBot]);
    setSelectedBotId(newBot.id);
  };

  const handleDeleteBot = (botId) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    setSelectedBotId(updatedBots[0]?.id || 1);
  };

  const updateCurrentBot = (updates) => {
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === selectedBotId 
          ? { ...bot, ...updates } 
          : bot
      )
    );
  };

  const handleAddKeyword = () => {
    if (newKeyword && !getCurrentBot().spamKeywords.includes(newKeyword)) {
      updateCurrentBot({
        spamKeywords: [...getCurrentBot().spamKeywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    updateCurrentBot({
      spamKeywords: getCurrentBot().spamKeywords.filter(k => k !== keyword)
    });
  };

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
              value={selectedBotId.toString()} 
              onValueChange={(value) => setSelectedBotId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bot" />
              </SelectTrigger>
              <SelectContent>
                {bots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id.toString()}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddBot} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bot
            </Button>
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
              value={currentBot.replyMessage}
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
                <TableHead>ID</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBot.logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.id}</TableCell>
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