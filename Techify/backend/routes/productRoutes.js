import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
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
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);
router
  .route("/:id/reviews/:reviewId")
  .put(authenticate, checkId, updateProductReview)
  .delete(authenticate, checkId, deleteProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;