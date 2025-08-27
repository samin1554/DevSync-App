import Header from "./headerdb";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import { 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Clock, 
  Users, 
  Target,
  BookOpen,
  Timer,
  TrendingUp,
  GraduationCap
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Organize your assignments and projects with smart prioritization and deadline tracking."
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Visualize your schedule with integrated academic calendar and deadline reminders."
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your productivity with detailed charts and insights into your study habits."
    },
    {
      icon: Timer,
      title: "Pomodoro Timer",
      description: "Focus better with built-in study sessions and break reminders."
    },
    {
      icon: BookOpen,
      title: "Study Notes",
      description: "Keep all your notes organized and easily searchable in one place."
    },
    {
      icon: TrendingUp,
      title: "Goal Tracking",
      description: "Set academic goals and monitor your progress throughout the semester."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Ultimate
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Study </span>
            Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your academic journey with StudyFlow's intelligent productivity dashboard. 
            Track tasks, manage deadlines, and boost your focus with tools designed specifically for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                Try Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
        
        {/* Preview Image Placeholder */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl h-64 md:h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-4 text-primary" size={64} />
                <p className="text-gray-600 text-lg">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help students stay organized, focused, and productive throughout their academic journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who have already improved their productivity with StudyFlow.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-sm" size={16} />
              </div>
              <span className="text-xl font-bold">StudyFlow</span>
            </div>
            <p className="text-gray-400">
              © 2025 StudyFlow. All rights reserved. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}