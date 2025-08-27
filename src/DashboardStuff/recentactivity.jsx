import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, Plus, Clock } from "lucide-react";
import { supabase } from "../backend/supabase-back";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setActivities([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("activites")
        .select("action, task_title, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { descending: true })
        .limit(5);
      if (error) {
        console.error(error);
      }
      setActivities(data || []);
      setLoading(false);
    }
    fetchActivities();
  }, []);

  return (
    <section className="mt-8">
      <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : activities.length === 0 ? (
              <div className="text-gray-500">No recent activity.</div>
            ) : (
              activities.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {/* You can add icons based on action if you want */}
                    <span className="text-primary text-sm">{activity.action[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> "{activity.task_title}" 
                      <span className="text-gray-600"> • {new Date(activity.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
