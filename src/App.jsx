import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateNote from "./components/CreateNote";
import NoteList from "./components/NoteList";
import noteService from "./services/noteService";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes when component mounts
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);
      setError(null);
      const data = await noteService.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(newNote) {
    try {
      const createdNote = await noteService.createNote(newNote);
      setNotes((prevNotes) => [createdNote, ...prevNotes]);
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    }
  }

  async function editNote(id, updatedNote) {
    try {
      const updated = await noteService.updateNote(id, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updated : note))
      );
    } catch (err) {
      setError('Failed to update note. Please try again.');
      console.error('Error updating note:', err);
    }
  }

  async function deleteNote(id) {
    try {
      await noteService.deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="content">
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#666'
          }}>
            Loading notes...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="content">
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            padding: '1rem',
            margin: '1rem 0',
            color: '#c33',
            textAlign: 'center'
          }}>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: '1rem',
                padding: '0.25rem 0.5rem',
                background: 'white',
                border: '1px solid #c33',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}
        <CreateNote onAdd={addNote} />
        <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
      </main>
      <Footer />
    </div>
  );
}

export default App;