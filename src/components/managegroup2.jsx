import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  BarChart2 as ChartIcon 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ManageGroup = () => {
  const { id } = useParams();  // Get the group ID from the URL parameter
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch group data on mount
  useEffect(() => {
    // Simulating data fetch with a timeout (you can replace with API call)
    setTimeout(() => {
      setGroupData({
        name: `Group ${id}`,
        memberCount: 56,
        recentMessages: 1200,
        activeMembers: 45,
        topMember: 'John Doe',
        activityTrend: [
          { day: 'Mon', messages: 20 },
          { day: 'Tue', messages: 30 },
          { day: 'Wed', messages: 50 },
          { day: 'Thu', messages: 75 },
          { day: 'Fri', messages: 60 },
          { day: 'Sat', messages: 85 },
          { day: 'Sun', messages: 120 }
        ], // Example trend data
        recentActivity: [
          { date: '2024-11-18', messages: 20 },
          { date: '2024-11-17', messages: 15 },
        ],
      });
      setLoading(false);
    }, 1500);  // Simulating loading time
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

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background">
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