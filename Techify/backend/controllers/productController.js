import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// --- PRODUCT CORE LOGIC ---

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const fields = Object.keys(req.fields || {}).length ? req.fields : req.body;
    const { name, description, price, category, quantity, brand } = fields;

    // Validation
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...fields },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- FETCH LOGIC ---

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return res.json(product);
    res.status(404).json({ error: "Product not found" });
  } catch (error) {
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// --- REVIEW LOGIC (FIXED) ---

// ➕ CREATE REVIEW: Add new customer feedback
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // 🚫 CHECK DUPLICATE: One review per customer
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      // 📝 SAVE REVIEW: Create new review object
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const updateProductReview = asyncHandler(async (req, res) => {
  // ✏️ UPDATE REVIEW: Edit existing customer feedback
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // 🔍 FIND REVIEW: Locate specific review to update
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // 🔒 CHECK PERMISSION: Only owner or admin can edit
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error("Not authorized");
    }

    // 💾 UPDATE DATA: Apply changes to rating/comment
    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    // 📊 RECALCULATE: Update product rating stats
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.json({ message: "Review updated" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// 🗑️ DELETE REVIEW: Remove customer feedback
const deleteProductReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // 🔍 FIND REVIEW: Locate specific review to delete
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // 🔒 CHECK PERMISSION: Only owner or admin can delete
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error("Not authorized");
    }

    // ❌ REMOVE REVIEW: Delete from database
    product.reviews.pull(req.params.reviewId);

    // 📊 RECALCULATE: Update product rating stats
    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// --- REMAINING FETCH LOGIC ---

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};