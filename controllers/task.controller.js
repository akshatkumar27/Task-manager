const Task = require("../models/Task.model");

//Creating a new task
async function createTask(req, res) {
	try {
		console.log(req.user);
		const task = new Task({
			...req.body,
			owner: req.user._id,
		});
		await task.save();
		res.status(201).json({ task, message: "Task created succesfully" });
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

//Getting all tasks
async function getTasks(req, res) {
	try {
		const tasks = await Task.find({
			owner: req.user._id,
		});
		res.status(200).json({
			code: 200,
			tasks,
			count: tasks.length,
			message: "Tasks Fetched Successfully",
		});
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//Getting a task by id
async function getSingleTask(req, res) {
	const taskid = req.params.id;
	try {
		const task = await Task.findOne({
			_id: taskid,
			owner: req.user._id,
		});
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.status(200).json({ task, message: "Task Fetched successfully" });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//Updating a task
async function updateTask(req, res) {
	const taskid = req.params.id;
	const updates = Object.keys(req.body);

	const allowedUpdates = ["description", "completed"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	console.log(updates.every((update) => allowedUpdates.includes(update)));

	if (!isValidOperation) {
		return res.status(400).json({ error: "Invalid Updates" });
	}

	try {
		const task = await Task.findOne({
			_id: taskid,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();

		res.json({
			message: "Task Updated Successfully",
		});
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//Deleting a task
async function deleteTask(req, res) {
	const taskid = req.params.id;
	try {
		const task = await Task.findOneAndDelete({
			_id: taskid,
			owner: req.user._id,
		});
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.status(200).json({ task, message: "Task Deleted successfully" });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}
module.exports = {
	createTask,
	getTasks,
	getSingleTask,
	updateTask,
	deleteTask,
};
