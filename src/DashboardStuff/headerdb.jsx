import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { GraduationCap } from "lucide-react";

export default function Header() {
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Implement logout functionality when backend is connected
    console.log("Logout clicked");
    // Redirect to sign-in page after logout
    window.location.href = "/signIn";
  };

  return (
    <header className="bg-base-100/95 backdrop-blur-sm border-b border-neutral sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white text-sm" size={16} />
          </div>
          <span className="text-xl font-bold text-base-content">DevSync</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              location.pathname === "/" ? "text-primary" : "text-neutral-content hover:text-base-content"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`font-medium transition-colors ${
              location.pathname === "/dashboard" ? "text-primary" : "text-neutral-content hover:text-base-content"
            }`}
          >
            Dashboard
          </Link>
          <a href="#features" className="text-neutral-content hover:text-base-content font-medium transition-colors">
            Features
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="btn btn-primary bg-base-100 text-primary hover:bg-primary hover:text-base-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
