import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { supabase } from "../backend/supabase-back";
import { useEffect, useState } from "react";

export default function TaskBreakdownChart() {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTaskData() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setTaskData([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("tasksbreakdown")
        .select("category")
        .eq("user_id", userData.user.id);
      if (error) {
        console.error(error);
        setTaskData([]);
        setLoading(false);
        return;
      }
      // Group by category and count
      const counts = {};
      data.forEach(task => {
        const cat = task.category || "Uncategorized";
        counts[cat] = (counts[cat] || 0) + 1;
      });
      // Build array for chart
      const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
      const chartData = Object.entries(counts).map(([name, value], idx) => ({
        name,
        value,
        color: COLORS[idx % COLORS.length]
      }));
      setTaskData(chartData);
      setLoading(false);
    }
    fetchTaskData();
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Task Categories</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PieChartIcon className="text-secondary" size={16} />
            <span>This month</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : taskData.length === 0 ? (
                <div className="text-gray-500">No tasks to display.</div>
              ) : (
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : taskData.length === 0 ? (
              <div className="text-gray-500">No tasks to display.</div>
            ) : (
              taskData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}