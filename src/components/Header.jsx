import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../backend/supabase-back';

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/signIn');
  };

  return (
    <header className="bg-base-100/95 backdrop-blur-sm border-b border-neutral sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          <span className="text-xl font-bold text-base-content">DevSync</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-neutral-content hover:text-base-content transition-colors">Features</a>
          <a href="#about" className="text-neutral-content hover:text-base-content transition-colors">About</a>
          <a href="#contact" className="text-neutral-content hover:text-base-content transition-colors">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-ghost text-base-content/80 text-sm"
              >
                Dashboard
              </Link>
              <span className="text-base-content/80 text-sm">{user.email}</span>
              <button onClick={handleSignOut} className="btn btn-outline btn-error px-4 py-2 rounded transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signIn"
                className="btn btn-primary bg-base-100 text-primary hover:bg-primary hover:text-base-100"
              >
                Sign In
              </Link>
              <Link
                to="/getStarted"
                className="btn btn-primary px-4 py-2 rounded transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
          <button className="md:hidden p-2 rounded hover:bg-base-300 transition-colors" aria-label="Open menu">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
