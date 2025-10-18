import express from "express";

import { authenticateUser } from "../Middleware/authentication.js";
import { addTask, changeTaskStatus, deleteTask, getAllTasks, updateTask, updateTaskStatus } from "../Controller/taskController.js";
import { loginUser, Signup } from "../Controller/authController.js";

const router = express.Router();


router.post("/signup", Signup);
router.post("/login", loginUser);
router.post("/add", authenticateUser, addTask);
router.get("/", authenticateUser, getAllTasks);
router.put("/update/:id", authenticateUser, updateTask);
router.delete("/delete/:id", authenticateUser, deleteTask);
router.patch("/status/:id", authenticateUser, changeTaskStatus);
router.put("/taskstatus/:id", authenticateUser, updateTaskStatus);

export default router;
