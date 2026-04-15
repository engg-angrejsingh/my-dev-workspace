// User model (MongoDB schema)
import User from "../models/userModel.js";

// Wrapper middleware for handling async errors in Express
import asyncHandler from "../middlewares/asyncHandler.js";

// Library used for hashing and comparing passwords
import bcrypt from "bcryptjs";

// Utility to generate JWT token and store it in cookie
import createToken from "../utils/createToken.js";

// Register a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    // Create auth token
    const token = createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      isAdmin: newUser.isAdmin,
      token: token,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Authenticate user and return token
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

 
  if (!existingUser) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

 
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  
  const token = createToken(res, existingUser._id);

 
  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: token,
  });
});

// Logout current user (clear JWT cookie)
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Fetch all users (excluding passwords)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// Get currently authenticated user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update logged-in user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 🔹 1. CHECK IF EMAIL IS PROVIDED AND DIFFERENT FROM CURRENT
    if (req.body.email && req.body.email !== user.email) {
      // Search for any user that already has this email
      const emailExists = await User.findOne({ email: req.body.email });
      
      if (emailExists) {
        res.status(400); // 400 Bad Request
        throw new Error("Email already exists. Please use a different one.");
      }
    }

    // 🔹 2. UPDATE FIELDS
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Hash password if a new one is provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // 🔹 3. SAVE TO DATABASE
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Delete a user by ID (admin action)
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent deleting admin accounts
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      message: "User removed",
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update user by ID (admin action)
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    await user.save();

    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Export controllers
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
