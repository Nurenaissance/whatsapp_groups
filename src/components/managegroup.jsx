import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users as UsersIcon, 
  Activity as ActivityIcon, 
  BarChart2 as ChartIcon,
  RefreshCw as RefreshIcon,
  Star as StarIcon,
  MessageCircle as MessageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ManageGroup = () => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net';

  // Fetch group data function
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch group details and activity
      const groupDetailsResponse = await axios.get(
        `${BASE_URL}/group_details/get_group_details/${id}`
      );

      const groupActivityResponse = await axios.get(
        `${BASE_URL}/group_details/get_group_activity/${groupDetailsResponse.data.data.group_name.toLowerCase()}`
      );

      // Process member data
      const members = groupDetailsResponse.data.data.members;
      const topRatedMember = [...members].sort((a, b) => b.rating - a.rating)[0];

      // Create activity data for the last 7 days
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }).reverse();

      const activityTrend = last7Days.map(day => ({
        day,
        messages: groupActivityResponse.data.data.messages_per_day[day] || 0
      }));

      // Process and transform the data
      const processedGroupData = {
        name: groupDetailsResponse.data.data.group_name,
        description: groupDetailsResponse.data.data.group_description,
        memberCount: members.length,
        activeMembers: groupActivityResponse.data.data.active_members?.length || 0,
        topMember: topRatedMember,
        totalMessages: groupActivityResponse.data.data.total_messages,
        activityTrend,
        members: members.slice(0, 5), // Show top 5 members
        messageCount: groupActivityResponse.data.data.total_messages || 0
      };

      setGroupData(processedGroupData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError('Failed to fetch group details');
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to load group details",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h2 className="text-2xl mb-4">Error Loading Group</h2>
        <p>{error}</p>
        <Button onClick={fetchGroupData} className="mt-4">
          <RefreshIcon className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">{groupData.name}</h1>
        <Button 
          variant="outline" 
          onClick={fetchGroupData} 
          disabled={loading}
        >
          <RefreshIcon className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{groupData.memberCount}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{groupData.activeMembers}</p>
              </div>
              <ActivityIcon className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{groupData.messageCount}</p>
              </div>
              <MessageIcon className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Member</p>
                <p className="text-lg font-bold truncate">{groupData.topMember?.name}</p>
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span>{groupData.topMember?.rating}</span>
                </div>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={groupData.topMember?.avatar} />
                <AvatarFallback>{groupData.topMember?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={groupData.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    borderColor: "hsl(var(--border))" 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Messages"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Top Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupData.members.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span>{member.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageGroup;