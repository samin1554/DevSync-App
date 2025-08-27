import { Card } from "../components/ui/card";
import { supabase } from "../backend/supabase-back";
import { useEffect, useState } from "react";

export default function WelcomeSection() {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({ tasksDueToday: 0, upcomingDeadlines: 0, dayStreak: 0, weeklyProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWelcomeData() {
      setLoading(true);
      // 1. Get user info
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setUserName("");
        setStats({ tasksDueToday: 0, upcomingDeadlines: 0, dayStreak: 0, weeklyProgress: 0 });
        setLoading(false);
        return;
      }
      setUserName(userData.user.user_metadata?.full_name || userData.user.email || "User");
      const userId = userData.user.id;
      // 2. Get today's date and week range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Sunday
      weekStart.setHours(0, 0, 0, 0);
      // 3. Fetch tasks due today and upcoming deadlines
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("due_date, status")
        .eq("user_id", userId);
      if (tasksError) {
        console.error(tasksError);
      }
      let tasksDueToday = 0;
      let upcomingDeadlines = 0;
      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          if (task.due_date) {
            const due = new Date(task.due_date);
            due.setHours(0, 0, 0, 0);
            if (due.getTime() === today.getTime()) tasksDueToday++;
            else if (due > today && due <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) upcomingDeadlines++;
          }
        });
      }
      // 4. Fetch study sessions for streak and weekly progress
      const { data: sessions, error: sessionsError } = await supabase
        .from("study_sessions")
        .select("start_time")
        .eq("user_id", userId)
        .order("start_time", { ascending: false });
      if (sessionsError) {
        console.error(sessionsError);
      }
      // Calculate day streak
      let dayStreak = 0;
      if (sessions && sessions.length > 0) {
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        let sessionDates = new Set(sessions.map(s => new Date(s.start_time).toISOString().slice(0, 10)));
        while (sessionDates.has(current.toISOString().slice(0, 10))) {
          dayStreak++;
          current.setDate(current.getDate() - 1);
        }
      }
      // Calculate weekly progress (number of sessions this week)
      let weeklyProgress = 0;
      if (sessions && sessions.length > 0) {
        weeklyProgress = sessions.filter(s => new Date(s.start_time) >= weekStart).length;
      }
      setStats({ tasksDueToday, upcomingDeadlines, dayStreak, weeklyProgress });
      setLoading(false);
    }
    fetchWelcomeData();
  }, []);

  return (
    <section className="mb-8">
      <Card className="bg-base-100 border border-neutral rounded-xl shadow-md p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {loading ? "Loading..." : `Welcome back, ${userName}! 👋`}
            </h1>
            <p className="text-gray-700 text-lg">
              {loading
                ? ""
                : `You have ${stats.tasksDueToday} tasks due today and ${stats.upcomingDeadlines} upcoming deadlines this week.`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{loading ? "-" : stats.dayStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{loading ? "-" : stats.weeklyProgress}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}