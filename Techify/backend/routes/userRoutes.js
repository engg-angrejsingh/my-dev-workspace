// Fixed by Copilot
// Import Express framework
import express from "express";

// Import controller functions for user registration and login
import { createUser, loginUser, logoutCurrentUser, getAllUsers} from "../controllers/userController.js";


import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


// Create a router instance from Express
// Router helps organize routes in separate files
const router = express.Router();


router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers);


// Route: POST /api/users/auth
// This route is used to LOGIN an existing user
router.post('/auth', loginUser);

router.post('/logout', logoutCurrentUser);


// Export router so it can be used in the main server file (server.js / app.js)
export default router;