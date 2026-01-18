import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateNote from "./components/CreateNote";
import NoteList from "./components/NoteList";

function App() {

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('quicknotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
  }, [notes]);

  function addNote(newNote) {
    const noteWithId = { ...newNote, id: Date.now() };
    setNotes((prevNotes) => [noteWithId, ...prevNotes]); 
  }

  function editNote(id, updatedNote) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...updatedNote, id } : note))
    );
  }

  function deleteNote(id) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }

  return (
    <div className="app">
      <Header />
      <main className="content">
        <CreateNote onAdd={addNote} />
        <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
      </main>
      <Footer />
    </div>
  );
}

export default App;