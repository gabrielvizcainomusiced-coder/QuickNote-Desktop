import React, { useState } from "react";

function EditNote(props) {
  const [tempNote, setTempNote] = useState({
    title: props.title,
    content: props.content,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setTempNote((prev) => ({ ...prev, [name]: value }));
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

      <div className="edit-actions">
        <button className="save-btn" onClick={() => props.onSave(tempNote)}>
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
