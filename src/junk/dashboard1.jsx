import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Info, TrendingUp, MessageCircle, Users, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced sample data with proper date formatting
const groupData = {
  'Group A': {
    stats: {
      totalMembers: 256,
      activeMembers: 180,
      messagesPerDay: 145,
      responseRate: 78
    },
    engagement: [
      { name: 'Mon', messages: 120, activeUsers: 85, responses: 95 },
      { name: 'Tue', messages: 145, activeUsers: 90, responses: 110 },
      { name: 'Wed', messages: 165, activeUsers: 95, responses: 130 },
      { name: 'Thu', messages: 180, activeUsers: 100, responses: 150 },
      { name: 'Fri', messages: 200, activeUsers: 110, responses: 170 }
    ],
    topics: [
      { name: 'Events', value: 45 },
      { name: 'Questions', value: 35 },
      { name: 'Resources', value: 30 },
      { name: 'Discussion', value: 25 },
      { name: 'Announcements', value: 20 }
    ],
    sentiment: [
      { name: 'Mon', positive: 60, neutral: 30, negative: 10 },
      { name: 'Tue', positive: 65, neutral: 25, negative: 10 },
      { name: 'Wed', positive: 70, neutral: 20, negative: 10 },
      { name: 'Thu', positive: 75, neutral: 20, negative: 5 },
      { name: 'Fri', positive: 80, neutral: 15, negative: 5 }
    ]
  },
  'Group B': {
    stats: {
      totalMembers: 189,
      activeMembers: 145,
      messagesPerDay: 98,
      responseRate: 82
    },
    engagement: [
      { name: 'Mon', messages: 90, activeUsers: 70, responses: 75 },
      { name: 'Tue', messages: 110, activeUsers: 75, responses: 90 },
      { name: 'Wed', messages: 130, activeUsers: 80, responses: 105 },
      { name: 'Thu', messages: 150, activeUsers: 85, responses: 120 },
      { name: 'Fri', messages: 170, activeUsers: 90, responses: 140 }
    ],
    topics: [
      { name: 'Support', value: 40 },
      { name: 'Feedback', value: 30 },
      { name: 'Updates', value: 25 },
      { name: 'Questions', value: 20 },
      { name: 'General', value: 15 }
    ],
    sentiment: [
      { name: 'Mon', positive: 55, neutral: 35, negative: 10 },
      { name: 'Tue', positive: 60, neutral: 30, negative: 10 },
      { name: 'Wed', positive: 65, neutral: 25, negative: 10 },
      { name: 'Thu', positive: 70, neutral: 25, negative: 5 },
      { name: 'Fri', positive: 75, neutral: 20, negative: 5 }
    ]
  }
};

// Calculate average data across all groups
const calculateAverageData = (data) => {
  const groups = Object.values(data);
  
  // Helper function to average arrays of objects
  const averageArrays = (arrays, keys) => {
    return arrays[0].map((_, index) => {
      const obj = { name: arrays[0][index].name };
      keys.forEach(key => {
        obj[key] = Math.round(
          arrays.reduce((sum, arr) => sum + arr[index][key], 0) / arrays.length
        );
      });
      return obj;
    });
  };

  return {
    stats: {
      totalMembers: Math.round(groups.reduce((acc, g) => acc + g.stats.totalMembers, 0) / groups.length),
      activeMembers: Math.round(groups.reduce((acc, g) => acc + g.stats.activeMembers, 0) / groups.length),
      messagesPerDay: Math.round(groups.reduce((acc, g) => acc + g.stats.messagesPerDay, 0) / groups.length),
      responseRate: Math.round(groups.reduce((acc, g) => acc + g.stats.responseRate, 0) / groups.length)
    },
    engagement: averageArrays(groups.map(g => g.engagement), ['messages', 'activeUsers', 'responses']),
    topics: groups[0].topics.map((topic, index) => ({
      name: topic.name,
      value: Math.round(groups.reduce((acc, g) => acc + g.topics[index].value, 0) / groups.length)
    })),
    sentiment: averageArrays(groups.map(g => g.sentiment), ['positive', 'neutral', 'negative'])
  };
};

const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [currentData, setCurrentData] = useState(calculateAverageData(groupData));

  useEffect(() => {
    setCurrentData(selectedGroup === 'all' ? calculateAverageData(groupData) : groupData[selectedGroup]);
  }, [selectedGroup]);

  const StatCard = ({ icon: Icon, title, value, subValue }) => (
    <Card className="flex-1">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
            {subValue && (
              <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
            )}
          </div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Group Analytics Dashboard</h1>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="Group A">Group A</SelectItem>
            <SelectItem value="Group B">Group B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Members"
          value={currentData.stats.totalMembers}
          subValue={`${currentData.stats.activeMembers} active`}
        />
        <StatCard
          icon={MessageCircle}
          title="Messages per Day"
          value={currentData.stats.messagesPerDay}
        />
        <StatCard
          icon={Activity}
          title="Response Rate"
          value={`${currentData.stats.responseRate}%`}
        />
        <StatCard
          icon={TrendingUp}
          title="Engagement Score"
          value={`${Math.round((currentData.stats.activeMembers / currentData.stats.totalMembers) * 100)}%`}
          subValue="Based on active members"
        />
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Engagement Metrics Over Time</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData.engagement} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#8884d8" 
                      name="Messages" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#82ca9d" 
                      name="Active Users"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responses" 
                      stroke="#ffc658" 
                      name="Responses"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Popular Topics</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData.topics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8" 
                      name="Message Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData.sentiment} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="positive" 
                      stroke="#82ca9d" 
                      name="Positive"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="neutral" 
                      stroke="#8884d8" 
                      name="Neutral"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="negative" 
                      stroke="#ff8042" 
                      name="Negative"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;