const express = require("express");
const router = express.Router();
const AuthenticationController = require("~v1/controllers/AuthenticationController");
const {
	checkValidateLogin,
	checkValidateRegister,
} = require("~v1/middleware/userMiddleware");

const { getLoyaltyPoints } = require("~v1/controllers/LoyaltyController");

const { verifyAccessToken } = require("~v1/middleware/tokenMiddleware");
const roleAuth = require("~/api/v1/middleware/roleAuth");

// router.get(
//     '/',
//     verifyAccessToken,
//     roleAuth('admin'),
//     AuthenticationController.getAllUsers,
// );

router.get("/", AuthenticationController.getAllUsers);

router.get("/loyalty", verifyAccessToken, getLoyaltyPoints);

router.get("/login", AuthenticationController.checkLogin);

router.get("/:id", verifyAccessToken, AuthenticationController.getUser);

router.get(
	"/checkValidToken/:token",
	AuthenticationController.checkValidateResetToken,
);

router.post("/resetPassword", AuthenticationController.resetPassword);
router.post("/forgotPassword", AuthenticationController.forgotPassword);

router.post(
	"/register",
	checkValidateRegister,
	AuthenticationController.register,
);

router.post("/login", checkValidateLogin, AuthenticationController.login);
router.post("/verifyAccount", AuthenticationController.verifyAccount);

router.post("/refresh-token", AuthenticationController.refreshToken);

router.patch("/:id", verifyAccessToken, AuthenticationController.update);

router.delete("/logout", AuthenticationController.logout);

router.patch(
	"/addAddress/:id",
	verifyAccessToken,
	AuthenticationController.addAddress,
);
router.patch(
	"/setDefaultAddress/:id",
	verifyAccessToken,
	AuthenticationController.setDefaultAddress,
);

router.patch(
	"/removeAddress/:id",
	verifyAccessToken,
	AuthenticationController.removeAddress,
);

module.exports = router;
