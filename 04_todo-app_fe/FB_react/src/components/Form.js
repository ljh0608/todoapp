import React, { useState } from "react";

function Form({ setTodoData }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTodo = {
      title: text,
      completed: false,
      note: "",
    };

    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((created) => {
        setTodoData((prev) => [...prev, created]);
        setInput("");
      })
      .catch((err) => console.error("POST Error:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-3"
    >
      <textarea
        value={input}
        onChange={handleChange}
        className="w-full px-3 py-2 text-gray-700 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="해야 할 일을 입력하세요."
      />
      <input
        type="submit"
        value="입력"
        className="px-4 py-4 bg-[#b7d6be] text-[#275b32]  border-2 border-[#93c3af] rounded hover:text-white hover:bg-[#275b32] cursor-pointer"
      />
    </form>
  );
}

export default Form;
