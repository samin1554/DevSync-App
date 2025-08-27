import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { supabase } from "../backend/supabase-back";

export default function ProductivityChart() {
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductivity() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setProductivityData([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("productivity")
        .select("day, tasks, focus, breaks")
        .eq("user_id", userData.user.id)
        .order("day", { ascending: true });
      if (error) {
        console.error(error);
      }
      setProductivityData(data || []);
      setLoading(false);
    }
    fetchProductivity();
  }, []);

  return (
    <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Weekly Productivity</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="text-primary" size={16} />
            <span>Last 7 days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : productivityData.length === 0 ? (
            <div className="text-gray-500">No productivity data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  name="Total Tasks"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="focus"
                  name="Focus Time"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#10b981" }}
                />
                <Line
                  type="monotone"
                  dataKey="breaks"
                  name="Breaks"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
