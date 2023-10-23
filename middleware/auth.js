const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "VerySecretValue");
		console.log(decoded);
		const user = await User.findOne({
			_id: decoded._id,
		});
		if (!user) {
			throw new Error("Unable to login , invalid credentials");
		}
		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		res.status(401).send({ error: error.message });
	}
};

module.exports = auth;
