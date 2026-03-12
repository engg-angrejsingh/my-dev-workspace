// Import Express
import express from "express";

// Import user controller functions
import { 
    createUser, 
    loginUser, 
    logoutCurrentUser, 
    getAllUsers, 
    getCurrentUserProfile, 
    updateCurrentUserProfile, 
    deleteUserById, 
    getUserById, 
    updateUserById
} from "../controllers/userController.js";

// Import authentication & authorization middleware
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Create router instance
const router = express.Router();


// =======================
// AUTH ROUTES
// =======================

// Register user
router.route('/')
    .post(createUser)
    .get(authenticate, authorizeAdmin, getAllUsers); // Admin: get all users

// Login
router.post('/auth', loginUser);

// Logout
router.post('/logout', logoutCurrentUser);


// =======================
// PROFILE ROUTES
// =======================

// Logged-in user profile
router
    .route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);


// =======================
// ADMIN USER MANAGEMENT
// =======================

router
    .route('/:id')
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateUserById);


// Export router
export default router;