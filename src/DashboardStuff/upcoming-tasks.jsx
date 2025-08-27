import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { supabase } from "../backend/supabase-back";

const PRIORITY_COLORS = {
  High: "bg-error/10 text-error",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-success/10 text-success",
};

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setTasks([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, due_date, priority, status")
        .eq("user_id", userData.user.id)
        .order("due_date", { ascending: true })
        .limit(3);
      if (error) {
        setTasks([]);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  return (
    <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Upcoming Tasks</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-500">No upcoming tasks.</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-base-200 transition-colors">
                <div className="w-4 h-4 border-2 border-primary rounded-sm mt-0.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-600">{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge className={`text-xs ${PRIORITY_COLORS[task.priority] || "bg-gray-100 text-gray-600"}`} variant="outline">
                    {task.priority || "No Priority"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}