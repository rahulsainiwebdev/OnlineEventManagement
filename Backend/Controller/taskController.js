import Task from "../Model/Task.js";

// ➕ Add Task
export const addTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user._id });
    await task.save();
    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 👀 Get All (only logged-in user's)
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update (only own task)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();
    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔄 Change Status
export const changeTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["Pending", "Active", "Completed", "Rejected"];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    task.status = status;
    await task.save();
    res.status(200).json({ success: true, message: "Status updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Update Only Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses
    const validStatuses = ["Pending", "Active", "Completed", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
