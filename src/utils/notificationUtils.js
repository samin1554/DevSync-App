import { supabase } from '../backend/supabase-back';

export const createNotification = async (notificationData) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userData.user.id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        related_id: notificationData.related_id || null,
        action_url: notificationData.action_url || null,
        is_read: false
      }
    ])
    .select()
    .single();

  return { data, error };
};

// Task-related notifications
export const createTaskNotification = async (task, notificationType) => {
  const notifications = {
    due_soon: {
      title: 'Task Due Soon',
      message: `"${task.title}" is due in ${task.reminder_time || 15} minutes`,
      type: 'task',
      action_url: '/dashboard'
    },
    overdue: {
      title: 'Task Overdue',
      message: `"${task.title}" is overdue`,
      type: 'task',
      action_url: '/dashboard'
    },
    completed: {
      title: 'Task Completed',
      message: `Great job! You completed "${task.title}"`,
      type: 'task',
      action_url: '/dashboard'
    }
  };

  return await createNotification({
    ...notifications[notificationType],
    related_id: task.id
  });
};

// Event-related notifications
export const createEventNotification = async (event, notificationType) => {
  const notifications = {
    reminder: {
      title: 'Event Reminder',
      message: `"${event.title}" starts in ${event.reminder_time || 15} minutes`,
      type: 'event',
      action_url: '/calendar'
    },
    starting: {
      title: 'Event Starting',
      message: `"${event.title}" is starting now`,
      type: 'event',
      action_url: '/calendar'
    }
  };

  return await createNotification({
    ...notifications[notificationType],
    related_id: event.id
  });
};

// Pomodoro-related notifications
export const createPomodoroNotification = async (sessionData) => {
  return await createNotification({
    title: 'Pomodoro Session Complete',
    message: `Great work! You completed a ${sessionData.duration} minute focus session`,
    type: 'pomodoro',
    action_url: '/pomodoro'
  });
};

// Note-related notifications
export const createNoteNotification = async (note, notificationType) => {
  const notifications = {
    reminder: {
      title: 'Note Reminder',
      message: `Reminder for note: "${note.title}"`,
      type: 'note',
      action_url: '/notes'
    }
  };

  return await createNotification({
    ...notifications[notificationType],
    related_id: note.id
  });
};

// System notifications
export const createSystemNotification = async (title, message, actionUrl = null) => {
  return await createNotification({
    title,
    message,
    type: 'system',
    action_url: actionUrl
  });
};

// Check for upcoming deadlines and create notifications
export const checkUpcomingDeadlines = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const now = new Date();
  const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

  // Check tasks due soon
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('status', 'incomplete')
    .gte('due_date', now.toISOString())
    .lte('due_date', fifteenMinutesFromNow.toISOString());

  if (tasks && tasks.length > 0) {
    for (const task of tasks) {
      await createTaskNotification(task, 'due_soon');
    }
  }

  // Check events starting soon
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userData.user.id)
    .gte('start_date', now.toISOString())
    .lte('start_date', fifteenMinutesFromNow.toISOString());

  if (events && events.length > 0) {
    for (const event of events) {
      await createEventNotification(event, 'reminder');
    }
  }
};
