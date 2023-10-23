const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	createTask,
	getTasks,
	getSingleTask,
	updateTask,
	deleteTask,
} = require("../controllers/task.controller");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getSingleTask);
router.patch("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
