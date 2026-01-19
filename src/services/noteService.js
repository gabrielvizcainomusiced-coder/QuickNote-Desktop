import { USE_BACKEND, API_URL } from '../config/api';

/**
 * Note Service - Handles all note operations
 * Supports both localStorage (for demo) and backend API
 */
class NoteService {
  /**
   * Get all notes
   * @returns {Promise<Array>} Array of notes
   */
  async getAllNotes() {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
    }

    // Fallback to localStorage
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  }

  /**
   * Create a new note
   * @param {Object} note - Note object with title and content
   * @returns {Promise<Object>} Created note
   */
  async createNote(note) {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`${API_URL}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
        });

        if (!response.ok) {
          throw new Error('Failed to create note');
        }

        return await response.json();
      } catch (error) {
        console.error('Error creating note:', error);
        throw error;
      }
    }

    // Fallback to localStorage
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

  /**
   * Update an existing note
   * @param {number|string} id - Note ID
   * @param {Object} note - Updated note data
   * @returns {Promise<Object>} Updated note
   */
  async updateNote(id, note) {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
        });

        if (!response.ok) {
          throw new Error('Failed to update note');
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating note:', error);
        throw error;
      }
    }

    // Fallback to localStorage
    const notes = await this.getAllNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...note,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('notes', JSON.stringify(notes));
      return notes[index];
    }
    throw new Error('Note not found');
  }

  /**
   * Delete a note
   * @param {number|string} id - Note ID
   * @returns {Promise<void>}
   */
  async deleteNote(id) {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete note');
        }

        return await response.json();
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    }

    // Fallback to localStorage
    const notes = await this.getAllNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem('notes', JSON.stringify(filtered));
  }
}

// Export a singleton instance
export default new NoteService();