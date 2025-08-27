
import React, { useState } from "react";
import { supabase } from "../backend/supabase-back";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Flag, Tag, Sparkles, CheckCircle2 } from "lucide-react";
import { createTaskNotification } from "../utils/notificationUtils";

const PRIORITIES = ["High", "Medium", "Low"];

export default function AddTask() {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!title || !priority) {
            setError("Title and Priority are required.");
            return;
        }
        setLoading(true);
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }
        // Insert task
        const { data: taskData, error: insertError } = await supabase.from("tasks").insert([
            {
                user_id: userData.user.id,
                title,
                due_date: dueDate || null,
                priority,
                category: category || null,
                status: "incomplete",
            },
        ]).select().single();
        
        if (insertError) {
            setError("Failed to add task. Please try again.");
        } else {
            setSuccess("Task added successfully!");
            
            // Create notification for the new task
            if (taskData) {
                await createTaskNotification(taskData, 'due_soon');
            }
            
            setTitle("");
            setDueDate("");
            setPriority("");
            setCategory("");
        }
        setLoading(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "text-red-500 bg-red-50 border-red-200 shadow-red-100";
            case "Medium": return "text-amber-500 bg-amber-50 border-amber-200 shadow-amber-100";
            case "Low": return "text-emerald-500 bg-emerald-50 border-emerald-200 shadow-emerald-100";
            default: return "text-gray-500 bg-gray-50 border-gray-200 shadow-gray-100";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "High": return "🔥";
            case "Medium": return "⚡";
            case "Low": return "🌱";
            default: return "📝";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-lg transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] hover:bg-white/90">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                                    Add New Task
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">Create something amazing today</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-all duration-200 p-3 rounded-xl hover:bg-white/60 backdrop-blur-sm border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span>Dashboard</span>
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <span>Task Title</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/60 backdrop-blur-sm group-hover:bg-white/80 placeholder-gray-400 text-gray-800"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Due Date Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>Due Date</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/60 backdrop-blur-sm group-hover:bg-white/80 text-gray-800"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Priority Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <Flag className="w-4 h-4 text-purple-500" />
                                <span>Priority</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <select
                                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/60 backdrop-blur-sm group-hover:bg-white/80 text-gray-800 appearance-none cursor-pointer"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    required
                                >
                                    <option value="">Select priority level</option>
                                    {PRIORITIES.map(p => (
                                        <option key={p} value={p}>{getPriorityIcon(p)} {p} Priority</option>
                                    ))}
                                </select>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Category Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <Tag className="w-4 h-4 text-green-500" />
                                <span>Category</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/60 backdrop-blur-sm group-hover:bg-white/80 placeholder-gray-400 text-gray-800"
                                    placeholder="e.g., Work, Personal, Study..."
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Priority Preview */}
                        {priority && (
                            <div className={`p-5 rounded-2xl border-2 ${getPriorityColor(priority)} transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getPriorityIcon(priority)}</span>
                                        <div>
                                            <p className="font-semibold">{priority} Priority</p>
                                            <p className="text-sm opacity-75">Task will be marked as {priority.toLowerCase()} priority</p>
                                        </div>
                                    </div>
                                    <Flag className="w-5 h-5 opacity-60" />
                                </div>
                            </div>
                        )}

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="p-5 bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl text-red-600 text-sm shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="p-5 bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl text-green-600 text-sm shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl relative overflow-hidden group"
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {loading ? (
                                <div className="flex items-center justify-center space-x-3 relative z-10">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Adding Task...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-3 relative z-10">
                                    <Plus className="w-5 h-5" />
                                    <span>Add Task</span>
                                    <Sparkles className="w-4 h-4 opacity-80" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}