import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Bot, QrCode } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      icon: Bot,
      title: "Bot Configuration",
      description: "Configure bot settings to manage spam messages and automate tasks in groups.",
      action: () => navigate('/settings/bot-configuration')
    },
    {
      icon: QrCode,
      title: "QR Code Scanner",
      description: "Scan the QR code to instantly connect your WhatsApp.",
      action: () => navigate('/settings/qr-scanner')
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>
            Manage and customize your application settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsSections.map((section, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <section.icon className="h-6 w-6 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-gray-500">{section.description}</p>
                </div>
              </div>
              <Button onClick={section.action}>
                Configure
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;