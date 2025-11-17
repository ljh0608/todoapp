import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

function List({ data, index, todoData, setTodoData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data?.title || "");

  // 완료 체크 토글
  const handleCompleteChange = () => {
    fetch(`http://localhost:5000/todos/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, completed: !data.completed }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTodoData((prev) =>
          prev.map((t) => (t._id === data._id ? updated : t))
        );
      })
      .catch(console.error);
  };

  // 항목 삭제
  const handleClick = () => {
    fetch(`http://localhost:5000/todos/${data._id}`, { method: "DELETE" })
      .then(() => {
        setTodoData((prev) => prev.filter((t) => t._id !== data._id));
      })
      .catch(console.error);
  };

  // 수정 입력 변화 감지
  const handleEditChange = (e) => setEditedTitle(e.target.value);

  // 수정 저장
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/todos/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, title: editedTitle }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTodoData((prev) =>
          prev.map((t) => (t._id === data._id ? updated : t))
        );
        setIsEditing(false);
      })
      .catch(console.error);
  };

  // 편집 모드일 때 렌더링
  if (isEditing) {
    return (
      <div className="w-full mb-4">
        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <div className="w-full py-2">
          {/* 수정 입력창 */}
            <input
              type="text"
              onChange={handleEditChange}
              className="px-3 py-2 mr-4 text-gray-500 border rounded shadow w-4/5"
              value={editedTitle}
              autoFocus
            />

            <button
              type="submit"
              className="px-3 py-1 mr-2 text-sm text-white bg-gray-200 rounded hover:bg-gray-400"
            >
              저장
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(data.title); // 취소 시 원래 제목 복원
              }}
              className="px-3 py-1 text-sm text-white bg-red-200 rounded hover:bg-red-400"
            >
              x
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 일반 모드 렌더링
  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between w-full px-4 py-2 my-2 border rounded transition-colors duration-200 ${
            data.completed ? "bg-[#d6e3d9] text-[#8ba590]" : "bg-white text-gray-800"
          }`}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.completed}
              onChange={handleCompleteChange}
              className="mr-2 transform scale-125 cursor-pointer"
            />
            <span className={`whitespace-pre-line break-words ${data.completed ? "line-through" : ""}`}>
              {data.title}
            </span>
          </div>

          <div>
          <div className="flex items-start flex-shrink-0 ml-4 gap-3">
              <button type="button" onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm text-white bg-gray-200 rounded hover:bg-gray-400 whitespace-nowrap [writing-mode:horizontal-tb]">
                수정</button>
              <button type="button" onClick={() => handleClick(data.id)}
                className="px-3 py-1 text-sm text-white bg-red-200 rounded hover:bg-red-400">
                x</button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(List);