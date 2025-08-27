import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../backend/supabase-back';

// PrivateRoute: Protects routes from unauthenticated access
export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/signIn', { replace: true });
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    // Optionally, show a loading spinner
    return <div>Loading...</div>;
  }

  // Render children if authenticated
  return isAuthenticated ? children : null;
} 