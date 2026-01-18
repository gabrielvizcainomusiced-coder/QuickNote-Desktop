import React from "react";
import NoteItem from "./NoteItem";

function NoteList(props) {
  // Show empty state when no notes
  if (props.notes.length === 0) {
    return (
      <div className="empty-state">
        <p>No notes yet!</p>
      </div>
    );
  }

  return (
    <div className="notes-container">
      {props.notes.map((noteItem) => (
        <NoteItem
          key={noteItem.id}
          id={noteItem.id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={props.onDelete}
          onEdit={props.onEdit}
        />
      ))}
    </div>
  );
}

export default NoteList;