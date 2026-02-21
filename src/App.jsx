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
      setError("Failed to load notes. Please try again.");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(newNote) {
    try {
      const createdNote = await noteService.createNote(newNote);
      setNotes((prevNotes) => [createdNote, ...prevNotes]);
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Error creating note:", err);
    }
  }

  async function editNote(id, updatedNote) {
    try {
      const updated = await noteService.updateNote(id, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updated : note))
      );
    } catch (err) {
      setError("Failed to update note. Please try again.");
      console.error("Error updating note:", err);
    }
  }

  async function deleteNote(id) {
    try {
      await noteService.deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="content">
          <div className="loading-state">Loading notes...</div>
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
          <div className="error-banner">
            {error}
            <button className="error-dismiss" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}
        <CreateNote onAdd={addNote} onError={setError} />
        <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
      </main>
      <Footer />
    </div>
  );
}

export default App;