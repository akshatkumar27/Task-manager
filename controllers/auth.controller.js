const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function register(req, res) {
	try {
		const username = req.body.username;
		const email = req.body.email;
		// Check if user already exists
		const user = await User.findOne({ Email: email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}
		if (req.body.username.length == 0) {
			return res.status(400).json({ message: "Username is empty" });
		}
		if (req.body.email.length == 0) {
			return res.status(400).json({ message: "Email is empty" });
		}
		if (req.body.password.length == 0) {
			return res.status(400).json({ message: "Password is empty" });
		}
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		console.log(username, email, req.body.password, hashedPassword);
		// Create new user
		const newUser = new User({
			Username: req.body.username,
			Email: email,
			Password: hashedPassword,
		});
		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

async function login(req, res) {
	try {
		const email = req.body.email;
		const password = req.body.password;
		// Check if user already exists
		const user = await User.findOne({ Email: email });
		if (user) {
			console.log(`User object retrieved: ${user}`);
			console.log(`Password: ${password}`);
			console.log(`User Password: ${user.Password}`);
			bcrypt.compare(password, user.Password, (err, result) => {
				if (err) {
					console.error(err);
					return res.json({
						message: "An error occurred during password comparison",
					});
				}
				if (!result) {
					res.json({
						message: "Invalid Password",
					});
				} else if (result) {
					let token = jwt.sign({ _id: user._id.toString() }, "VerySecretValue");
					console.log(result);
					res.json({
						status: "true",
						code: 200,
						message: "Logged in successfully",
						token,
						user_id: user._id,
					});
				}
			});
		} else {
			res.json({
				message: "User not found",
				status: "false",
				code: 400,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

module.exports = { register, login };
