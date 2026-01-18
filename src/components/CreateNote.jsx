import React, { useState } from "react";

function CreateNote(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((previousNote) => ({
      ...previousNote,
      [name]: value,
    }));
  }

  function submitNote(event) {
    event.preventDefault();
    
    // Validation: don't allow empty notes
    if (!note.title.trim() && !note.content.trim()) {
      alert("Please add a title or content to your note!");
      return;
    }

    props.onAdd(note);
    setNote({ title: "", content: "" });
  }

  return (
    <form onSubmit={submitNote}>
      <input
        name="title"
        placeholder="Title"
        value={note.title}
        onChange={handleChange}
      />
      <textarea
        name="content"
        placeholder="Write your note here..."
        value={note.content}
        onChange={handleChange}
        rows="3"
      />
      <button type="submit">+</button>
    </form>
  );
}

export default CreateNote;