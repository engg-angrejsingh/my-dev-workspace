// 📦 PACKAGES: Import required libraries and modules
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// 🔗 UTILS: Database connection and route handlers
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from './routes/uploadRoutes.js'

// ⚙️ SETUP: Load environment variables and connect to database
dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

// 🚀 APP: Create Express application
const app = express();

// 🛡️ MIDDLEWARE: Handle requests, cookies, and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🛣️ ROUTES: API endpoints for different features
// 🛣️ ROUTES: API endpoints for different features
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use('/api/upload', uploadRoutes);

// 📁 STATIC FILES: Serve uploaded images
const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 🚀 START SERVER: Listen for incoming requests
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
