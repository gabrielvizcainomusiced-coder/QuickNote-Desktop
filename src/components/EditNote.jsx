import React, { useState } from "react";

function EditNote(props) {
  const [tempNote, setTempNote] = useState({
    title: props.title,
    content: props.content,
  });
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setTempNote((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!tempNote.title.trim() || !tempNote.content.trim()) {
      setError("Both title and content are required!");
      return;
    }
    setError(null);
    props.onSave(tempNote);
  }

  return (
    <div className="edit-state">
      <input
        name="title"
        value={tempNote.title}
        onChange={handleChange}
        className="edit-title"
      />
      <textarea
        className="edit-content"
        name="content"
        value={tempNote.content}
        onChange={handleChange}
      />
      {error && (
        <p className="edit-error">{error}</p>
      )}
      <div className="edit-actions">
        <button className="save-btn" onClick={handleSave}>
          ✓
        </button>
        <button className="cancel-btn" onClick={props.onCancel}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default EditNote;