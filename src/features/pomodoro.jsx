import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Timer, Coffee, CheckCircle } from "lucide-react";

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [longBreakTime, setLongBreakTime] = useState(15);
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
    
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    // Update timer when session length changes and timer is not running
    useEffect(() => {
        if (!isRunning) {
            if (!isBreak) {
                setTimeLeft(workTime * 60);
            } else {
                // Determine if it's a long break or short break
                if (sessions % 4 === 3) {
                    setTimeLeft(longBreakTime * 60);
                } else {
                    setTimeLeft(breakTime * 60);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workTime, breakTime, longBreakTime]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        if (!isBreak) {
            // Work session completed
            setCompletedSessions(prev => prev + 1);
            setSessions(prev => prev + 1);
            if (sessions % 4 === 3) {
                // Long break after 4 sessions
                setTimeLeft(longBreakTime * 60);
                setIsBreak(true);
            } else {
                // Short break
                setTimeLeft(breakTime * 60);
                setIsBreak(true);
            }
            if (autoStartBreaks) {
                setIsRunning(true);
            }
        } else {
            // Break completed
            setTimeLeft(workTime * 60);
            setIsBreak(false);
            if (autoStartPomodoros) {
                setIsRunning(true);
            }
        }
    };

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(workTime * 60);
        setIsBreak(false);
    };

    const skipTimer = () => {
        handleTimerComplete();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        const totalTime = isBreak ? (breakTime * 60) : (workTime * 60);
        return ((totalTime - timeLeft) / totalTime) * 100;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Pomodoro Timer
                            </h1>
                            <p className="text-sm text-gray-500">Stay focused, stay productive</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Settings className="w-5 h-5 text-gray-600" />
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

                {/* Timer Display */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center relative">
                            <div 
                                className="absolute inset-2 rounded-full bg-gradient-to-r from-gray-50 to-white flex items-center justify-center"
                                style={{
                                    background: `conic-gradient(from 0deg, ${isBreak ? '#10b981' : '#f43f5e'} ${getProgressPercentage()}%, transparent ${getProgressPercentage()}%)`
                                }}
                            >
                                <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-inner">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-gray-800 mb-2">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                                            isBreak 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {isBreak ? 'Break Time' : 'Focus Time'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    {!isRunning ? (
                        <button
                            onClick={startTimer}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <Play className="w-5 h-5" />
                            <span>Start</span>
                        </button>
                    ) : (
                        <button
                            onClick={pauseTimer}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <Pause className="w-5 h-5" />
                            <span>Pause</span>
                        </button>
                    )}
                    
                    <button
                        onClick={resetTimer}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                    
                    <button
                        onClick={skipTimer}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Skip</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{completedSessions}</div>
                        <div className="text-sm text-blue-500">Completed</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{sessions}</div>
                        <div className="text-sm text-green-500">Sessions</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {Math.floor((completedSessions * workTime) / 60)}
                        </div>
                        <div className="text-sm text-purple-500">Hours Focused</div>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="bg-gray-50 rounded-xl p-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Work Time (minutes)</label>
                                <input
                                    type="number"
                                    value={workTime}
                                    onChange={(e) => setWorkTime(parseInt(e.target.value))}
                                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    min="1"
                                    max="60"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Break Time (minutes)</label>
                                <input
                                    type="number"
                                    value={breakTime}
                                    onChange={(e) => setBreakTime(parseInt(e.target.value))}
                                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    min="1"
                                    max="30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Long Break (minutes)</label>
                                <input
                                    type="number"
                                    value={longBreakTime}
                                    onChange={(e) => setLongBreakTime(parseInt(e.target.value))}
                                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    min="1"
                                    max="60"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={autoStartBreaks}
                                        onChange={(e) => setAutoStartBreaks(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Auto-start breaks</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={autoStartPomodoros}
                                        onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Auto-start pomodoros</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 