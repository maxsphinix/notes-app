import React, { useState, useEffect } from 'react';
import { Search, Trash2, Plus, AlertCircle, AlignLeft, AlignCenter, AlignRight, StickyNote, Pencil, Save, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  formatting: {
    fontFamily: string;
    fontSize: string;
    textCase: string;
    textAlign: string;
  };
}

const MAX_CHARS = 500;

const FONT_FAMILIES = [
  { name: 'Default', value: 'font-sans' },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Mono', value: 'font-mono' }
];

const FONT_SIZES = [
  { name: 'Small', value: 'text-sm' },
  { name: 'Normal', value: 'text-base' },
  { name: 'Large', value: 'text-lg' },
  { name: 'Extra Large', value: 'text-xl' }
];

const TEXT_CASES = [
  { name: 'Normal', value: 'normal-case' },
  { name: 'Uppercase', value: 'uppercase' },
  { name: 'Lowercase', value: 'lowercase' },
  { name: 'Capitalize', value: 'capitalize' }
];

const TEXT_ALIGNMENTS = [
  { name: 'Left', value: 'text-left', icon: AlignLeft },
  { name: 'Center', value: 'text-center', icon: AlignCenter },
  { name: 'Right', value: 'text-right', icon: AlignRight }
];

const Logo = () => (
  <div className="flex items-center justify-center gap-2 mb-4">
    <div className="relative">
      <StickyNote 
        size={40} 
        className="text-purple-600 dark:text-purple-400"
      />
      <Pencil 
        size={20} 
        className="absolute -bottom-1 -right-1 text-purple-800 dark:text-purple-600 transform rotate-12"
      />
    </div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-transparent bg-clip-text">
      JotSpace
    </h1>
  </div>
);

function App() {
  const { theme, toggleTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formatting, setFormatting] = useState({
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    textCase: 'normal-case',
    textAlign: 'text-left'
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const note: Note = {
      id: crypto.randomUUID(),
      content: newNote,
      createdAt: new Date().toISOString(),
      formatting: { ...formatting }
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setFormatting(note.formatting);
  };

  const saveEdit = () => {
    if (!editingNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? { ...editingNote, formatting: { ...formatting } }
        : note
    ));
    setEditingNote(null);
    setFormatting({
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      textCase: 'normal-case',
      textAlign: 'text-left'
    });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setFormatting({
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      textCase: 'normal-case',
      textAlign: 'text-left'
    });
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const FormattingControl = ({ 
    label, 
    options, 
    value, 
    onChange 
  }: { 
    label: string;
    options: { name: string; value: string; icon?: React.ComponentType<any> }[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-300 min-w-20">{label}:</label>
      <div className="flex gap-1">
        {options.map(option => (
          option.icon ? (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`p-2 rounded ${
                value === option.value
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <option.icon size={16} />
            </button>
          ) : (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-3 py-1 rounded text-sm ${
                value === option.value
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {option.name}
            </button>
          )
        ))}
      </div>
    </div>
  );

  const FormattingControls = () => (
    <div className="space-y-3 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <FormattingControl
        label="Font"
        options={FONT_FAMILIES}
        value={formatting.fontFamily}
        onChange={(value) => setFormatting(prev => ({ ...prev, fontFamily: value }))}
      />
      <FormattingControl
        label="Size"
        options={FONT_SIZES}
        value={formatting.fontSize}
        onChange={(value) => setFormatting(prev => ({ ...prev, fontSize: value }))}
      />
      <FormattingControl
        label="Case"
        options={TEXT_CASES}
        value={formatting.textCase}
        onChange={(value) => setFormatting(prev => ({ ...prev, textCase: value }))}
      />
      <FormattingControl
        label="Align"
        options={TEXT_ALIGNMENTS}
        value={formatting.textAlign}
        onChange={(value) => setFormatting(prev => ({ ...prev, textAlign: value }))}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="text-gray-600" size={20} />
            ) : (
              <Sun className="text-yellow-400" size={20} />
            )}
          </button>
        </div>

        <Logo />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        {/* New Note Input */}
        {!editingNote && (
          <div className="mb-8 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
            <FormattingControls />
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write your note here..."
              className={`w-full h-32 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none ${formatting.fontFamily} ${formatting.fontSize} ${formatting.textCase} ${formatting.textAlign}`}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {newNote.length}/{MAX_CHARS} characters
              </div>
              <button
                onClick={addNote}
                disabled={newNote.trim() === ''}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <AlertCircle className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={32} />
            <p className="text-gray-500 dark:text-gray-400">
              {notes.length === 0
                ? "No notes yet. Create your first note!"
                : "No notes match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {editingNote?.id === note.id ? (
                  <>
                    <FormattingControls />
                    <textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({
                        ...editingNote,
                        content: e.target.value.slice(0, MAX_CHARS)
                      })}
                      className={`w-full h-32 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none mb-2 ${formatting.fontFamily} ${formatting.fontSize} ${formatting.textCase} ${formatting.textAlign}`}
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {editingNote.content.length}/{MAX_CHARS} characters
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                        >
                          <Save size={16} />
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(note.createdAt)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(note)}
                          className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-gray-800 dark:text-gray-100 whitespace-pre-wrap ${note.formatting.fontFamily} ${note.formatting.fontSize} ${note.formatting.textCase} ${note.formatting.textAlign}`}>
                      {note.content}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;