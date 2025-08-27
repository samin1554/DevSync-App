import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../backend/supabase-back";
import { 
    ArrowLeft, 
    Plus, 
    Search, 
    Edit3, 
    Trash2, 
    Save, 
    X, 
    StickyNote, 
    Tag,
    Calendar,
    Clock,
    Filter
} from "lucide-react";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        category: "",
        color: "blue"
    });
    
    const navigate = useNavigate();

    const colors = [
        { name: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
        { name: "green", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
        { name: "purple", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
        { name: "yellow", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
        { name: "pink", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
        { name: "gray", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" }
    ];

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userData.user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setNotes(data);
        }
        setLoading(false);
    };

    const createNote = async () => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const { error } = await supabase.from("notes").insert([
            {
                user_id: userData.user.id,
                title: newNote.title,
                content: newNote.content,
                category: newNote.category,
                color: newNote.color
            }
        ]);

        if (!error) {
            setNewNote({ title: "", content: "", category: "", color: "blue" });
            setShowCreateForm(false);
            fetchNotes();
        }
    };

    const updateNote = async () => {
        if (!currentNote) return;

        const { error } = await supabase
            .from("notes")
            .update({
                title: currentNote.title,
                content: currentNote.content,
                category: currentNote.category,
                color: currentNote.color
            })
            .eq("id", currentNote.id);

        if (!error) {
            setIsEditing(false);
            setCurrentNote(null);
            fetchNotes();
        }
    };

    const deleteNote = async (noteId) => {
        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", noteId);

        if (!error) {
            fetchNotes();
        }
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];

    const getColorClasses = (colorName) => {
        const color = colors.find(c => c.name === colorName) || colors[0];
        return `${color.bg} ${color.border} ${color.text}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                                <StickyNote className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    My Notes
                                </h1>
                                <p className="text-sm text-gray-500">Capture your thoughts and ideas</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Note</span>
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

                    {/* Search and Filter */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No notes found. Create your first note!</p>
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className={`bg-white rounded-2xl shadow-lg border-2 ${getColorClasses(note.color)} p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                                onClick={() => {
                                    setCurrentNote(note);
                                    setIsEditing(false);
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-semibold text-lg truncate flex-1">{note.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentNote(note);
                                                setIsEditing(true);
                                            }}
                                            className="p-1 hover:bg-white/50 rounded transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNote(note.id);
                                            }}
                                            className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm line-clamp-3 mb-4">{note.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    {note.category && (
                                        <span className="px-2 py-1 bg-white/50 rounded-full">
                                            {note.category}
                                        </span>
                                    )}
                                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Note Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Create New Note</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={newNote.title}
                                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                        placeholder="Note title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content</label>
                                    <textarea
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                                        rows={6}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none"
                                        placeholder="Write your note here..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <input
                                            type="text"
                                            value={newNote.category}
                                            onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                            placeholder="e.g., Work, Personal..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Color</label>
                                        <select
                                            value={newNote.color}
                                            onChange={(e) => setNewNote({...newNote, color: e.target.value})}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                        >
                                            {colors.map(color => (
                                                <option key={color.name} value={color.name}>
                                                    {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-6 py-2 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createNote}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        Create Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Note Modal */}
            {currentNote && isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Edit Note</h2>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentNote(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={currentNote.title}
                                        onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content</label>
                                    <textarea
                                        value={currentNote.content}
                                        onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                                        rows={6}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <input
                                            type="text"
                                            value={currentNote.category}
                                            onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Color</label>
                                        <select
                                            value={currentNote.color}
                                            onChange={(e) => setCurrentNote({...currentNote, color: e.target.value})}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                                        >
                                            {colors.map(color => (
                                                <option key={color.name} value={color.name}>
                                                    {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setCurrentNote(null);
                                        }}
                                        className="px-6 py-2 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateNote}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 