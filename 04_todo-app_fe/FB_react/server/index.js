const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const TodoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  note: String,
});

const Todo = mongoose.model("Todo", TodoSchema);

// 조회
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 저장
app.post("/todos", async (req, res) => {
  const newTodo = await Todo.create(req.body);
  res.json(newTodo);
});

// 수정
app.put("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// 삭제
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 전체 삭제
app.delete("/todos", async (req, res) => {
  await Todo.deleteMany({});
  res.json({ success: true });
});

// 서버 시작
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
