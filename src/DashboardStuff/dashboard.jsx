import Header from "./headerdb";
import WelcomeSection from "./welcome-section";
import QuickActions from "./quick-actions";
import ProductivityChart from "./productivity-chart";
import TaskBreakdownChart from "./tasksbreakdown";
import UpcomingTasks from "./upcoming-tasks";
import MotivationalSection from "./motivation";
import StudyStats from "./study-stats";
import RecentActivity from "./recentactivity";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection />
        <QuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProductivityChart />
            <TaskBreakdownChart />
          </div>
          
          <div className="space-y-6">
            <UpcomingTasks />
            <MotivationalSection />
            <StudyStats />
          </div>
        </div>
        
        <RecentActivity />
      </main>
    </div>
  );
}