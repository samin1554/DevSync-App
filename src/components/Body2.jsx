import React from "react";
import {
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  Bell,
  Bot,
} from "lucide-react";

export default function Body2() {
  const features = [
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description:
        "Create, organize, and prioritize tasks with intelligent categorization and automatic scheduling suggestions.",
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description:
        "Seamlessly sync with your favorite calendar apps. Never miss a deadline or double-book again.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share projects, assign tasks, and track progress with your team in real-time collaboration.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Visualize your productivity with detailed reports and insights to optimize your workflow.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get intelligent reminders that adapt to your schedule and help you stay on track.",
    },
    {
      icon: Bot,
      title: "AI-Powered Chatbot (Coming Soon)",
      description:
        "Lightning-fast tasks management AI, specializing in helping and advicing schedules.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-base-100">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
          Everything You Need to Stay Scheduled
        </h2>
        <p className="text-xl text-neutral-content max-w-3xl mx-auto">
          Powerful features designed to help you organize, prioritize, and
          accomplish more every day. Easier management is easier success.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-base-100 border border-neutral rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="text-indigo-600 mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-content">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


