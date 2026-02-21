import { USE_BACKEND, API_URL } from '../config/api';

/**
 * NoteService abstracts the data source so components never call
 * fetch() or localStorage directly. Toggle between modes via VITE_USE_BACKEND.
 */
class NoteService {
  async getAllNotes() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      return response.json();
    }

    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  }

  async createNote(note) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!response.ok) throw new Error('Failed to create note');
      return response.json();
    }

    const notes = await this.getAllNotes();
    const newNote = {
      id: Date.now(),
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    return newNote;
  }

  async updateNote(id, note) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    }

    const notes = await this.getAllNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');

    notes[index] = { ...notes[index], ...note, updated_at: new Date().toISOString() };
    localStorage.setItem('notes', JSON.stringify(notes));
    return notes[index];
  }

  async deleteNote(id) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    }

    const notes = await this.getAllNotes();
    const note = notes.find(n => n.id === id);
    if (!note) throw new Error('Note not found');

    localStorage.setItem('notes', JSON.stringify(notes.filter(n => n.id !== id)));
    return note;
  }
}

export default new NoteService();