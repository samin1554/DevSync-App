import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import GetStarted from './pages/GetStarted.jsx';
import SignIn from './pages/SignIn.jsx';
import Dashboard from './DashboardStuff/dashboard.jsx';
import Home from './DashboardStuff/home.jsx';
import AddTask from './features/addtask.jsx';
import Pomodoro from './features/pomodoro.jsx';
import Notes from './features/notes.jsx';
import Calendar from './features/Calender.jsx';
import Notifications from './features/notifications.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './App.css';

// 1. Define routes
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signIn', element: <SignIn/> },
  { path: '/getStarted', element: <GetStarted /> },
  { path: '/dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/home', element: <Home /> },
  { path: '/add-task', element: <PrivateRoute><AddTask /></PrivateRoute> },
  { path: '/pomodoro', element: <PrivateRoute><Pomodoro /></PrivateRoute> },
  { path: '/notes', element: <PrivateRoute><Notes /></PrivateRoute> },
  { path: '/calendar', element: <PrivateRoute><Calendar /></PrivateRoute> },
  { path: '/notifications', element: <PrivateRoute><Notifications /></PrivateRoute> }
]);

// 2. Render RouterProvider and pass router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
