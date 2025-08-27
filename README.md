# DevSync - Modern Productivity Suite

A beautifully designed, feature-rich productivity application built with React, Vite, and Supabase. DevSync helps you organize your life, manage tasks, track time, and stay productive with a modern, intuitive interface.

## ✨ Features

### 🎯 Core Productivity Tools
- **Smart Task Management** - Create, organize, and prioritize tasks with intelligent categorization
- **Calendar Integration** - Full calendar with event management and reminders
- **Pomodoro Timer** - Focus sessions with customizable work/break cycles
- **Notes System** - Rich text notes with categories and color coding
- **Smart Notifications** - Real-time alerts and reminders for tasks and events

### 🎨 Modern Design
- **Glassmorphism UI** - Beautiful frosted glass effects and modern aesthetics
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Adaptive theming with DaisyUI
- **Smooth Animations** - Engaging micro-interactions and transitions

### 🔧 Technical Features
- **Real-time Updates** - Live data synchronization with Supabase
- **User Authentication** - Secure login and user management
- **Data Persistence** - All data stored securely in Supabase
- **Modern Stack** - Built with React 19, Vite, Tailwind CSS, and Lucide Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samin1554/DevSync-App.git
   cd DevSync-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Set up the following tables:
     - `tasks` - for task management
     - `events` - for calendar events
     - `notes` - for notes storage
     - `notifications` - for notification system
   - Copy your Supabase URL and anon key

4. **Configure environment**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start using DevSync!

## 📱 Features Overview

### Dashboard
- **Welcome Section** - Personalized greeting and daily motivation
- **Quick Actions** - Fast access to all features
- **Productivity Charts** - Visual progress tracking
- **Recent Activity** - Latest updates and actions
- **Upcoming Tasks** - What's due next

### Task Management
- **Add Tasks** - Quick task creation with priority and categories
- **Task Breakdown** - Visual analytics of task completion
- **Due Date Tracking** - Never miss a deadline
- **Priority Levels** - High, Medium, Low priority system

### Calendar
- **Event Management** - Create, edit, and delete events
- **Multiple Views** - Month and week calendar views
- **Color Coding** - Different colors for different event types
- **Reminders** - Customizable notification times

### Pomodoro Timer
- **Focus Sessions** - Customizable work intervals
- **Break Management** - Short and long breaks
- **Session Tracking** - Monitor your productivity
- **Settings** - Adjust work/break durations

### Notes
- **Rich Text** - Create detailed notes with formatting
- **Categories** - Organize notes by type
- **Color Coding** - Visual organization system
- **Search** - Find notes quickly

### Notifications
- **Real-time Alerts** - Instant notifications for important events
- **Smart Filtering** - Search and filter notifications
- **Action Integration** - Click to navigate to related features
- **Read/Unread** - Track notification status

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **UI Components**: DaisyUI, Lucide React Icons
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Main feature components
│   ├── addtask.jsx     # Task creation
│   ├── Calender.jsx    # Calendar management
│   ├── notes.jsx       # Notes system
│   ├── notifications.jsx # Notification center
│   └── pomodoro.jsx    # Pomodoro timer
├── DashboardStuff/     # Dashboard components
├── pages/             # Authentication pages
├── backend/           # Supabase configuration
├── utils/             # Utility functions
└── images/            # Static assets
```

## 🎯 Roadmap

- [ ] **AI-Powered Chatbot** - Coming Soon
- [ ] **Team Collaboration** - Share projects and tasks
- [ ] **Mobile App** - Native iOS and Android apps
- [ ] **Advanced Analytics** - Detailed productivity insights
- [ ] **Integration APIs** - Connect with external services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samiul** - [GitHub](https://github.com/samin1554)

Built with ❤️ to enhance productivity and help people achieve their goals.

---

**DevSync** - Organize Your Life, Achieve Your Goals
