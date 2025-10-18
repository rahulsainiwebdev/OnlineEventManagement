import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // ✅ Link to user
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  category: {
    type: String,
    enum: ["Personal", "Work", "Other"],
    default: "Other",
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Completed", "Rejected"],
    default: "Pending",
  },
  reminder: Date,
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
