import React, { useState } from 'react';
import { Box, Typography, Button, Switch, TextField, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';  // Import delete icon

const BotConfiguration = () => {
  const [bots, setBots] = useState([
    { id: 1, name: "Bot 1", isBotEnabled: true, spamKeywords: "", messageLimit: 3, replyMessage: "", spamAction: "Warn", logs: [] },
  ]);
  const [selectedBotId, setSelectedBotId] = useState(1);
  const [botName, setBotName] = useState('');
  const [spamKeywords, setSpamKeywords] = useState('');
  const [messageLimit, setMessageLimit] = useState(3);
  const [replyMessage, setReplyMessage] = useState('');
  const [spamAction, setSpamAction] = useState('Warn');
  const [groupAssignments, setGroupAssignments] = useState([]);
  const [isBotEnabled, setIsBotEnabled] = useState(true);
  const [selectedBot, setSelectedBot] = useState('bot1');
  const [botData, setBotData] = useState({
    bot1: { keywords: [], logs: [], messageLimit: 3 },
    bot2: { keywords: [], logs: [], messageLimit: 5 },
  });

  // Handle Bot Enable/Disable Toggl

  // Handle Keyword Addition
  const handleKeywordChange = (event) => {
    setSpamKeywords(event.target.value);
  };

  const addKeyword = () => {
    if (spamKeywords && !botData[selectedBot].keywords.includes(spamKeywords)) {
      setBotData(prevData => {
        const updatedBotData = { ...prevData };
        updatedBotData[selectedBot].keywords.push(spamKeywords);
        return updatedBotData;
      });
      setSpamKeywords('');
    }
  };
  const handleBotToggle = (event) => {
    const updatedBots = bots.map(bot => 
      bot.id === selectedBotId ? { ...bot, isBotEnabled: event.target.checked } : bot
    );
    setBots(updatedBots);
  };

  const handleBotChange = (event) => {
    const selectedBot = bots.find(bot => bot.id === event.target.value);
    setSelectedBotId(selectedBot.id);
    setBotName(selectedBot.name);
    setSpamKeywords(selectedBot.spamKeywords);
    setMessageLimit(selectedBot.messageLimit);
    setReplyMessage(selectedBot.replyMessage);
    setSpamAction(selectedBot.spamAction);
  };

  const handleSpamKeywordChange = (event) => setSpamKeywords(event.target.value);
  const handleMessageLimitChange = (event) => setMessageLimit(event.target.value);
  const handleReplyMessageChange = (event) => setReplyMessage(event.target.value);
  const handleBotNameChange = (event) => setBotName(event.target.value);

  const handleSaveBotChanges = () => {
    const updatedBots = bots.map(bot =>
      bot.id === selectedBotId
        ? { ...bot, name: botName, spamKeywords, messageLimit, replyMessage, spamAction }
        : bot
    );
    setBots(updatedBots);
  };

  const handleAddNewBot = () => {
    const newBot = {
      id: bots.length + 1,
      name: `Bot ${bots.length + 1}`,
      isBotEnabled: true,
      spamKeywords: '',
      messageLimit: 3,
      replyMessage: '',
      spamAction: "Warn",
      logs: []
    };
    setBots([...bots, newBot]);
    setSelectedBotId(newBot.id);
  };

  const handleGroupAssignmentChange = (event) => setGroupAssignments(event.target.value);

  const handleDeleteBot = (botId) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    setSelectedBotId(updatedBots[0]?.id || 1); // Reset to the first bot if any bot is left
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'message', headerName: 'Message', width: 400 },
    { field: 'action', headerName: 'Action', width: 150 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bot Configuration
      </Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Manage Bots
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddNewBot}>
            Add New Bot
          </Button>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Select Bot</InputLabel>
            <Select
              value={selectedBotId}
              onChange={handleBotChange}
              label="Select Bot"
            >
              {bots.map((bot) => (
                <MenuItem key={bot.id} value={bot.id}>
                  {bot.name}
                  <IconButton 
                    edge="end" 
                    color="secondary" 
                    onClick={() => handleDeleteBot(bot.id)} 
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Bot Name */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bot Name
          </Typography>
          <TextField
            fullWidth
            label="Bot Name"
            variant="outlined"
            value={botName}
            onChange={handleBotNameChange}
          />
        </CardContent>
      </Card>

      {/* Bot Status */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bot Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {bots.find(bot => bot.id === selectedBotId)?.isBotEnabled ? 'AI Enabled' : 'AI Disabled'}
            </Typography>
            <Switch checked={bots.find(bot => bot.id === selectedBotId)?.isBotEnabled || false} onChange={handleBotToggle} />
          </Box>
        </CardContent>
      </Card>

      {/* Spam Keywords, Message Limit, and Action */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spam Detection Settings
              </Typography>
              <TextField
                fullWidth
                label="Spam Keyword"
                variant="outlined"
                value={spamKeywords}
                onChange={handleKeywordChange}
                helperText="Type a keyword and click Add to include it"
              />
              <Button variant="contained" color="primary" onClick={addKeyword} sx={{ marginTop: 2 }}>
                Add Keyword
              </Button>

              <Box sx={{ marginTop: 2 }}>
                {botData[selectedBot].keywords.map((keyword, index) => (
                  <Chip label={keyword} key={index} sx={{ marginRight: 1, marginBottom: 1 }} />
                ))}
              </Box>

              <TextField
                fullWidth
                label="Max Messages per Minute"
                variant="outlined"
                type="number"
                value={messageLimit}
                onChange={handleMessageLimitChange}
                sx={{ marginTop: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Bot Action Logs */}
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bot Action Logs
              </Typography>
              <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                  rows={bots.find(bot => bot.id === selectedBotId)?.logs || []}
                  columns={columns}
                  pageSize={5}
                  checkboxSelection
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reply Message for Spam */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Spam Reply Message
          </Typography>
          <TextField
            fullWidth
            label="Reply to Spam Message"
            variant="outlined"
            value={replyMessage}
            onChange={handleReplyMessageChange}
            multiline
            rows={4}
          />
        </CardContent>
      </Card>

      <Button variant="contained" color="primary" onClick={handleSaveBotChanges}>
        Save Changes
      </Button>
    </Box>
  );
};

export default BotConfiguration;
