module.exports = (...allowed) => {
	const isAllowed = (role) => allowed.includes(role);

	return (req, res, next) => {
		if (req.user && isAllowed(req.user.role)) {
			console.log("allowed:", allowed);

			console.log("Access granted");
			return next();
		}
		if (!req.user) {
			console.warn("Access denied: User not authenticated");
		} else if (!isAllowed(req.user.role)) {
			console.warn(`Access denied: User role '${req.user.role}' not allowed`);
		}

		return res.status(403).json({
			message: "Forbidden: Insufficient permission",
		});
	};
};
