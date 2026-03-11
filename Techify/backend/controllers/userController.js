// Import User model (MongoDB schema for users)
import User from '../models/userModel.js'

// Import middleware that handles async errors automatically
import asyncHandler from '../middlewares/asyncHandler.js'

// Import bcryptjs for password hashing and comparison
import bcrypt from 'bcryptjs';

// Import function that generates JWT token and stores it in cookie
import createToken from '../utils/createToken.js'


// ---------------------------
// REGISTER USER CONTROLLER
// ---------------------------
const createUser = asyncHandler(async (req, res) => {

    // Get username, email, and password from request body
    const { username, email, password } = req.body;

    // Check if required fields are missing
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the inputs.");
    }

    // Check if a user already exists with the same email
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Generate salt for secure hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object using the User model
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        // Save the user to the database
        await newUser.save();

        // Create JWT token and send it as HTTP-only cookie
        createToken(res, newUser._id);

        // Send user data back in response
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            isAdmin: newUser.isAdmin,
        });

    } catch (error) {
        // Handle errors if saving user fails
        res.status(400);
        throw new Error("Invalid user data");
    }

});


// ---------------------------
// LOGIN USER CONTROLLER
// ---------------------------
const loginUser = asyncHandler(async(req, res) => {

    // Get email and password from request body
    const {email, password} = req.body;

    // Find user in database using email
    const existingUser = await User.findOne({email});

    // Check if user exists
    if(existingUser){

        // Compare entered password with hashed password in database
        const isPasswordVaild = await bcrypt.compare(password, existingUser.password);

        if(isPasswordVaild){

            // Generate JWT token and store in cookie
            createToken(res, existingUser._id);

            // Send logged-in user data
            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                password: existingUser.password,
                isAdmin: existingUser.isAdmin
            });

            return;
        }
    }

});


// Export controllers so they can be used in routes
export { createUser,  loginUser };