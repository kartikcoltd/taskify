'use client';

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet } from 'lucide-react';
import { DailyEnergyBar } from '@/components/progress/DailyEnergyBar';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function ProgressPage() {
  const { tasks, points, pointsEarned, pointsSpent, pointsEarnedToday } = useAppContext();

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const taskData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const pointsData = [
    { name: 'Points', Earned: pointsEarned, Spent: pointsSpent },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Your Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DailyEnergyBar pointsEarnedToday={pointsEarnedToday} dailyGoal={40} />

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
            <CardDescription>Completed vs. Pending Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} dataKey="value">
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Points Flow (All Time)</CardTitle>
            <CardDescription>Total Points Earned vs. Total Points Spent</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pointsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))' }}/>
                <Legend />
                <Bar dataKey="Earned" fill="hsl(var(--chart-1))" />
                <Bar dataKey="Spent" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points Saved</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{points}</div>
            <p className="text-xs text-muted-foreground">Your current point balance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
