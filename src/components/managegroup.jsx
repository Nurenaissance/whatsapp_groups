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
  RefreshCw as RefreshIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast'; // Assuming you have a toast component

const ManageGroup = () => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group data function
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual endpoints when available
      const groupDetailsResponse = await axios.get(
        `https://x01xx96q-8000.inc1.devtunnels.ms/group_details/get_group_details/${3}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const membersResponse = await axios.get(
        `https://x01xx96q-8000.inc1.devtunnels.ms/group_details/get_group_members/${3}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Process and transform the data
      const processedGroupData = {
        name: groupDetailsResponse.data.group_name || `Group ${id}`,
        memberCount: membersResponse.data.members?.length || 0,
        activeMembers: membersResponse.data.members?.length || 0, // TODO: Implement active members logic
        topMember: membersResponse.data.members?.[0]?.[0] || 'No top member', // First member as top member for now
        
        // TODO: Implement actual activity tracking
        recentMessages: 0,
        activityTrend: [
          { day: 'Mon', messages: 0 },
          { day: 'Tue', messages: 0 },
          { day: 'Wed', messages: 0 },
          { day: 'Thu', messages: 0 },
          { day: 'Fri', messages: 0 },
          { day: 'Sat', messages: 0 },
          { day: 'Sun', messages: 0 }
        ],
        recentActivity: [
          // TODO: Implement actual recent activity tracking
          { date: new Date().toISOString().split('T')[0], messages: 0 }
        ]
      };

      setGroupData(processedGroupData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError('Failed to fetch group details');
      setLoading(false);
      
      // Show toast notification
      toast({
        title: "Error",
        description: "Failed to load group details",
        variant: "destructive"
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchGroupData();
  }, [id]);

  // Render loading state
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

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h2 className="text-2xl mb-4">Error Loading Group</h2>
        <p>{error}</p>
        <Button onClick={fetchGroupData} className="mt-4">
          <RefreshIcon className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={fetchGroupData} 
          disabled={loading}
        >
          <RefreshIcon className="mr-2 w-4 h-4" />
          Refresh Group Data
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Group Overview Card */}
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary">
              <UsersIcon className="w-6 h-6" />
              {groupData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{groupData.memberCount}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{groupData.activeMembers}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Top Member: <span className="font-medium text-foreground">{groupData.topMember}</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ChartIcon className="w-6 h-6" />
              Weekly Activity Trend
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
                <Legend />
                <Line type="monotone" dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ActivityIcon className="w-6 h-6" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groupData.recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <span className="text-sm text-muted-foreground">{activity.date}</span>
                <span className="text-sm font-medium">{activity.messages} messages</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageGroup;