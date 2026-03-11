// Import Express framework
import express from "express";

// Import controller functions for user registration and login
import { createUser, loginUser } from "../controllers/userController.js";

// Create a router instance from Express
// Router helps organize routes in separate files
const router = express.Router();


// Route: POST /api/users
// This route is used to REGISTER a new user
router.route('/').post(createUser);


// Route: POST /api/users/auth
// This route is used to LOGIN an existing user
router.post('/auth', loginUser);


// Export router so it can be used in the main server file (server.js / app.js)
export default router;