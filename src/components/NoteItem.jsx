import React, { useState, useRef } from "react";
import EditNote from "./EditNote";

function NoteItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [capturedHeight, setCapturedHeight] = useState(null);
  const noteBodyRef = useRef(null);

  function startEditing() {
    if (noteBodyRef.current) {
      // Capture the actual content height before switching to edit mode
      const height = noteBodyRef.current.scrollHeight;
      setCapturedHeight(height);
    }
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
    setCapturedHeight(null);
  }

  function handleSave(updatedNote) {
    props.onEdit(props.id, updatedNote);
    stopEditing();
  }

  return (
    <div className="note">
      <div 
        className="note-body"
        ref={noteBodyRef}
        style={capturedHeight ? { minHeight: `${capturedHeight}px` } : {}}
      >
        {isEditing ? (
          <EditNote
            title={props.title}
            content={props.content}
            onSave={handleSave}
            onCancel={stopEditing}
          />
        ) : (
          <>
            <h1>{props.title}</h1>
            <p>{props.content}</p>
          </>
        )}
      </div>

      {!isEditing && (
        <>
          <button className="edit-btn" onClick={startEditing}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => props.onDelete(props.id)}>
            X
          </button>
        </>
      )}
    </div>
  );
}

export default NoteItem;