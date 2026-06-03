import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";
import { registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateUserProfile,
    currentUser } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current").get(verifyJWT, currentUser);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);

export default router;