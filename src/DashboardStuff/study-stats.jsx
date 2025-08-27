import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Clock, CheckCircle, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../backend/supabase-back";

export default function StudyStats() {
  const [stats, setStats] = useState({ focusTime: 0, tasksCompleted: 0, tasksTotal: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setStats({ focusTime: 0, tasksCompleted: 0, tasksTotal: 0, streak: 0 });
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      // 1. Fetch today's study sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      const { data: sessions, error: sessionsError } = await supabase
        .from("study_sessions")
        .select("start_time, end_time, duration")
        .eq("user_id", userId)
        .gte("start_time", todayISO);
      if (sessionsError) {
        console.error(sessionsError);
      }
      // Calculate total focus time today (in minutes)
      let focusTime = 0;
      if (sessions && sessions.length > 0) {
        focusTime = sessions.reduce((sum, s) => sum + (s.duration || ((new Date(s.end_time) - new Date(s.start_time)) / 60000)), 0);
      }
      // 2. Fetch today's completed tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, status, created_at")
        .eq("user_id", userId)
        .gte("created_at", todayISO);
      if (tasksError) {
        console.error(tasksError);
      }
      const tasksCompleted = tasks ? tasks.filter(t => t.status === "completed").length : 0;
      const tasksTotal = tasks ? tasks.length : 0;
      // 3. Calculate current streak (days with at least one study session)
      // Fetch all sessions for the user, order by start_time desc
      const { data: allSessions, error: allSessionsError } = await supabase
        .from("study_sessions")
        .select("start_time")
        .eq("user_id", userId)
        .order("start_time", { ascending: false });
      if (allSessionsError) {
        console.error(allSessionsError);
      }
      let streak = 0;
      if (allSessions && allSessions.length > 0) {
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        let sessionDates = new Set(allSessions.map(s => new Date(s.start_time).toISOString().slice(0, 10)));
        while (sessionDates.has(current.toISOString().slice(0, 10))) {
          streak++;
          current.setDate(current.getDate() - 1);
        }
      }
      setStats({ focusTime, tasksCompleted, tasksTotal, streak });
      setLoading(false);
    }
    fetchStats();
  }, []);

  function formatFocusTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h > 0 ? h + 'h ' : ''}${m}m`;
  }

  const statItems = [
    {
      icon: Clock,
      label: "Focus Time Today",
      value: formatFocusTime(stats.focusTime),
      color: "text-primary"
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: `${stats.tasksCompleted}/${stats.tasksTotal}`,
      color: "text-accent"
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.streak} day${stats.streak === 1 ? '' : 's'}`,
      color: "text-warning"
    }
  ];

  return (
    <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Study Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            statItems.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <stat.icon className={stat.color} size={16} />
                  <span className="text-gray-700">{stat.label}</span>
                </div>
                <span className="font-bold text-gray-900">{stat.value}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
