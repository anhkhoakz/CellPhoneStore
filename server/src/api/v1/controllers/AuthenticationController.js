const {
	register,
	verifyAccount,
	login,
	refreshToken,
	logout,
	update,
	forgotPassword,
	resetPassword,
	addAddress,
	setDefaultAddress,
	checkValidateResetToken,
	removeAddress
} = require("~/api/v1/services/AccountService");

require("dotenv").config();
const CreateError = require("http-errors");

const User = require("~v1/models/Account");
const FederatedCredential = require("~v1/models/federatedCredential");
const { checkValidateLogin } = require("../middleware/userMiddleware");

module.exports = {
	getAllUsers: async (req, res, next) => {
		try {
			const users = await User.find();

			console.log("Users:", users);
			return res.status(200).json({ users });
		} catch (err) {
			next(err);
		}
	},

	getUser: async (req, res, next) => {
		try {
			const { id } = req.params;
			const user = await User.findById(id).select("-password");

			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}
			return res.status(200).json({
				success: true,
				message: user,
			});
		} catch (err) {
			next(err);
		}
	},

	forgotPassword: async (req, res, next) => {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({ message: "Email is required" });
			}

			const { code, message, elements } = await forgotPassword(req.body);

			// res.redirect(process.env.FRONTEND_URL + '/change-password');

			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	resetPassword: async (req, res, next) => {
		try {
			const { password, confirmPassword, token } = req.body;

			if (password !== confirmPassword) {
				return res.status(400).json({ message: "Passwords do not match" });
			}

			if (!password || !token) {
				return res.status(400).json({ message: "Password are required" });
			}

			const { code, message, elements } = await resetPassword(req.body);

			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	checkValidateResetToken: async (req, res, next) => {
		try {
			const { token } = req.params;

			if (!token) {
				return res.status(400).json({ message: "Token is required" });
			}

			const { code, message, elements } = await checkValidateResetToken(token);

			return res.status(code).json({ code, message, elements });
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	verifyGoogleAccount: async (accessToken, refreshToken, profile, cb) => {
		try {
			const cred = await FederatedCredential.findOne({
				provider: "https://accounts.google.com",
				subject: profile.id,
			});

			const email = profile.emails[0].value;

			if (!cred) {
				const newUser = new User({
					username: profile.displayName,
					email: email,
				});
				const savedUser = await newUser.save();

				const newCred = new FederatedCredential({
					user_id: savedUser._id,
					provider: "https://accounts.google.com",
					subject: profile.id,
				});
				await newCred.save();

				const user = {
					id: savedUser._id,
					name: savedUser.name,
					email: savedUser.e,
				};
				return cb(null, user);
			}
			const user = await User.findById(cred.user_id);

			if (!user) {
				return cb(null, false);
			}
			return cb(null, user);
		} catch (err) {
			return cb(err);
		}
	},
	verifyAccount: async (req, res, next) => {
		try {
			console.log(req.body.otp);
			const { email, otp } = req.body;

			if (!email || !otp) {
				return res.status(400).json({ message: "Email and OTP are required" });
			}
			const { code, message, elements } = await verifyAccount(req.body);
			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
	register: async (req, res, next) => {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({ message: "Email is required" });
			}

			const { code, message, elements } = await register(req.body);

			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res
					.status(400)
					.json({ message: "Email and Password are required" });
			}

			const { code, message } = await login(req.body);

			if (code !== 200) {
				return res.status(code).json({
					message,
				});
			}

			const { userId, accessToken } = message;

			res.cookie("accessToken", accessToken, {
				maxAge: process.env.COOKIE_TOKEN_EXPIRY,
				httpOnly: false,
				// secure: true,
				sameSite: "lax",
			});

			res.cookie("userId", userId, {
				maxAge: 365 * 24 * 60 * 60 * 1000,
				httpOnly: false,
				// secure: true,
				sameSite: "lax",
			});

			return res.status(code).json({
				code,
				message: accessToken,
				role: message.role,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	checkLogin: async (req, res, next) => {
		try {
			const userId = req.cookies?.userId;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: No user ID provided.",
				});
			}

			const user = await User.findById(userId);

			if (user) {
				return res.status(200).json({
					success: true,
					message: user.role,
				});
			}

			return res.status(401).json({
				success: false,
				message: "Unauthorized: User not found.",
			});
		} catch (err) {
			console.error("Error in checkLogin:", err);
			return res.status(500).json({
				success: false,
				message: "Internal Server Error",
			});
		}
	},

	logout: async (req, res, next) => {
		try {
			const { code, message } = await logout(req);

			res.clearCookie("userId");
			res.clearCookie("accessToken");
			req.user = null;

			return res.status(code).json({
				message,
			});
		} catch (err) {
			next({ code: 500, message: err.message });
		}
	},
	refreshToken: async (req, res, next) => {
		try {
			if (!req.body.refreshToken) {
				throw CreateError.BadRequest("Refresh token is required");
			}

			const { code, message, elements } = await refreshToken(req.body);

			if (code !== 200) {
				return res.status(code).json({
					message,
				});
			}

			return res.status(code).json({
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	update: async (req, res, next) => {
		try {
			const { id } = req.params;

			const { code, message, elements } = await update(req.body, id);

			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	addAddress: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { code, message, elements, detail } = await addAddress(
				req.body,
				id,
			);

			return res.status(code).json({
				code,
				message,
				elements,
				detail,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	setDefaultAddress: async (req, res, next) => {
		try {
			const { id } = req.params;
			const userId = req.cookies.userId;

			const { code, message, elements, detail } = await setDefaultAddress(
				userId,
				id,
			);

			return res.status(code).json({
				code,
				message,
				elements,
				detail,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	removeAddress: async (req, res, next) => {
		try {
			const { id } = req.params;
			const userId = req.cookies.userId;

			const { code, message, elements } = await removeAddress(userId, id);

			return res.status(code).json({
				code,
				message,
				elements,
			});
		} catch (err) {
			console.error(err);
			next(err);
		}
	}
};
