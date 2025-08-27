import { Button } from "../components/ui/button";
import { Plus, Calendar, Clock, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { 
      icon: Plus, 
      label: "Add Task", 
      color: "primary",
      onClick: () => navigate('/add-task')
    },
    { 
      icon: Calendar, 
      label: "Calendar", 
      color: "secondary",
      onClick: () => navigate('/calendar')
    },
    { 
      icon: Clock, 
      label: "Pomodoro", 
      color: "accent",
      onClick: () => navigate('/pomodoro')
    },
    { 
      icon: StickyNote, 
      label: "Notes", 
      color: "warning",
      onClick: () => navigate('/notes')
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary group-hover:bg-primary/20";
      case "secondary":
        return "bg-secondary/10 text-secondary group-hover:bg-secondary/20";
      case "accent":
        return "bg-accent/10 text-accent group-hover:bg-accent/20";
      case "warning":
        return "bg-warning/10 text-warning group-hover:bg-warning/20";
      default:
        return "bg-primary/10 text-primary group-hover:bg-primary/20";
    }
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="bg-base-100 p-4 h-auto border-neutral hover:shadow-md transition-shadow group"
            onClick={action.onClick}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(action.color)}`}>
                <action.icon size={20} />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
