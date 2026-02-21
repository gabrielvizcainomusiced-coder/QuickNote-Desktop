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

    if (!note.title.trim() || !note.content.trim()) {
      props.onError("Both title and content are required!");
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