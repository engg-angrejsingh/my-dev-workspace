// packages
import path from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// utils
import connectDB from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Hello Buddy");
});

// server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});