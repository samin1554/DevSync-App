import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '../backend/supabase-back';
import { createEventNotification } from '../utils/notificationUtils';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Bell
} from 'lucide-react';

const CATEGORIES = [
  { name: 'personal', label: 'Personal', color: 'bg-blue-500' },
  { name: 'work', label: 'Work', color: 'bg-green-500' },
  { name: 'study', label: 'Study', color: 'bg-purple-500' },
  { name: 'meeting', label: 'Meeting', color: 'bg-orange-500' },
  { name: 'deadline', label: 'Deadline', color: 'bg-red-500' },
  { name: 'pomodoro', label: 'Pomodoro', color: 'bg-pink-500' }
];

const COLORS = [
  { name: 'blue', bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'green', bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200' },
  { name: 'purple', bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'orange', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200' },
  { name: 'red', bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200' },
  { name: 'pink', bg: 'bg-pink-500', light: 'bg-pink-50', border: 'border-pink-200' }
];

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    category: 'personal',
    color: 'blue',
    reminder_time: 15,
    is_all_day: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('start_date', { ascending: true });

    if (!error && data) {
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_date,
        end: event.end_date,
        backgroundColor: getColorByValue(event.color),
        borderColor: getColorByValue(event.color),
        extendedProps: {
          description: event.description,
          category: event.category,
          color: event.color,
          reminder_time: event.reminder_time,
          is_all_day: event.is_all_day
        }
      }));
      setEvents(formattedEvents);
    }
    setLoading(false);
  };

  const getColorByValue = (colorName) => {
    const color = COLORS.find(c => c.name === colorName);
    return color ? color.bg.replace('bg-', '#') : '#3b82f6';
  };

  const handleDateClick = (arg) => {
    setEventForm({
      title: '',
      description: '',
      start_date: arg.dateStr,
      end_date: arg.dateStr,
      category: 'personal',
      color: 'blue',
      reminder_time: 15,
      is_all_day: false
    });
    setCurrentEvent(null);
    setIsEditing(false);
    setShowEventModal(true);
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    setCurrentEvent({
      id: event.id,
      title: event.title,
      description: event.extendedProps.description || '',
      start_date: event.startStr,
      end_date: event.endStr || event.startStr,
      category: event.extendedProps.category || 'personal',
      color: event.extendedProps.color || 'blue',
      reminder_time: event.extendedProps.reminder_time || 15,
      is_all_day: event.extendedProps.is_all_day || false
    });
    setEventForm({
      title: event.title,
      description: event.extendedProps.description || '',
      start_date: event.startStr,
      end_date: event.endStr || event.startStr,
      category: event.extendedProps.category || 'personal',
      color: event.extendedProps.color || 'blue',
      reminder_time: event.extendedProps.reminder_time || 15,
      is_all_day: event.extendedProps.is_all_day || false
    });
    setIsEditing(true);
    setShowEventModal(true);
  };

  const createEvent = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data: eventData, error: insertError } = await supabase.from("events").insert([
      {
        user_id: userData.user.id,
        title: eventForm.title,
        description: eventForm.description,
        start_date: eventForm.start_date,
        end_date: eventForm.end_date || eventForm.start_date,
        category: eventForm.category,
        color: eventForm.color,
        reminder_time: eventForm.reminder_time,
        is_all_day: eventForm.is_all_day
      }
    ]).select().single();

    if (!insertError) {
      setShowEventModal(false);
      setEventForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        category: 'personal',
        color: 'blue',
        reminder_time: 15,
        is_all_day: false
      });
      
      // Create notification for the new event
      if (eventData) {
        await createEventNotification(eventData, 'reminder');
      }
      
      fetchEvents();
    }
  };

  const updateEvent = async () => {
    if (!currentEvent) return;

    const { error } = await supabase
      .from('events')
      .update({
        title: eventForm.title,
        description: eventForm.description,
        start_date: eventForm.start_date,
        end_date: eventForm.end_date || eventForm.start_date,
        category: eventForm.category,
        color: eventForm.color,
        reminder_time: eventForm.reminder_time,
        is_all_day: eventForm.is_all_day
      })
      .eq('id', currentEvent.id);

    if (!error) {
      setShowEventModal(false);
      setCurrentEvent(null);
      setIsEditing(false);
      fetchEvents();
    }
  };

  const deleteEvent = async () => {
    if (!currentEvent) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', currentEvent.id);

    if (!error) {
      setShowEventModal(false);
      setCurrentEvent(null);
      setIsEditing(false);
      fetchEvents();
    }
  };

  const renderEventContent = (eventInfo) => {
    const category = CATEGORIES.find(c => c.name === eventInfo.event.extendedProps.category);
    return (
      <div className="p-1">
        <div className={`text-xs font-medium ${category?.color} text-white px-1 py-0.5 rounded`}>
          {eventInfo.event.title}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Calendar
                </h1>
                <p className="text-sm text-gray-500">Manage your events and deadlines</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventContent={renderEventContent}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              editable={true}
              droppable={true}
            />
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    placeholder="Enter event title..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 resize-none"
                    placeholder="Enter event description..."
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      value={eventForm.start_date}
                      onChange={(e) => setEventForm({...eventForm, start_date: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      value={eventForm.end_date}
                      onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Category and Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category.name} value={category.name}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <select
                      value={eventForm.color}
                      onChange={(e) => setEventForm({...eventForm, color: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    >
                      {COLORS.map(color => (
                        <option key={color.name} value={color.name}>
                          {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reminder and All Day */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Reminder (minutes before)</label>
                    <input
                      type="number"
                      value={eventForm.reminder_time}
                      onChange={(e) => setEventForm({...eventForm, reminder_time: parseInt(e.target.value)})}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                      min="0"
                      max="1440"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      checked={eventForm.is_all_day}
                      onChange={(e) => setEventForm({...eventForm, is_all_day: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">All day event</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  {isEditing && (
                    <button
                      onClick={deleteEvent}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                  <div className="flex items-center space-x-3 ml-auto">
                    <button
                      onClick={() => setShowEventModal(false)}
                      className="px-6 py-2 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={isEditing ? updateEvent : createEvent}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'Update' : 'Create'} Event</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}