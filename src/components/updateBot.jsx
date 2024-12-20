import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot as BotIcon, Save as SaveIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axiosInstance from './api';
const BotConfigSection = ({ groupId, currentBotConfig }) => {
  const [bots, setBots] = useState([]);
  const [selectedBotConfig, setSelectedBotConfig] = useState(currentBotConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/bot_details/get_bot_config');
      
      if (!response.data || response.data.bots.length === 0) {
        setBots([]);
        return;
      }
  
      const processedBots = response.data.bots.map((bot) => ({
        ...bot,
        logs: bot.logs.map(log => ({
          ...log,
          id: crypto.randomUUID(),
          user: log.phone_or_name,
          action: log.action || 'No action'
        }))
      }));
  
      setBots(processedBots);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch available bots",
        variant: "destructive"
      });
      setBots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBot = async () => {
    if (!selectedBotConfig) {
      toast({
        title: "Error",
        description: "Please select a bot configuration",
        variant: "destructive"
      });
      return;
    }

    try {
      setUpdateLoading(true);
      
      // Use the axiosInstance which should already have the tenant ID header configured
      await axiosInstance.post(`group_details/group_update_botconfig/${groupId}`, {
        botconfig_id: selectedBotConfig // Updated to match backend expectation
      });
      
      toast({
        title: "Success",
        description: "Bot configuration updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to update bot configuration",
        variant: "destructive"
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotIcon className="h-5 w-5" />
          Bot Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              value={selectedBotConfig}
              onValueChange={setSelectedBotConfig}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a bot configuration" />
              </SelectTrigger>
              <SelectContent>
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleUpdateBot}
            disabled={updateLoading || !selectedBotConfig}
          >
            {updateLoading ? (
              "Updating..."
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Update Bot
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotConfigSection;