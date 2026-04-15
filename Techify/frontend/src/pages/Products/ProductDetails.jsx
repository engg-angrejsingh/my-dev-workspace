// 🛒 PRODUCT PAGE: Shows full product info, image, and reviews
// Main page for viewing product details and managing reviews
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {showSuccess, showError} from '../../utils/toast.js'
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox, FaClock, FaShoppingCart, FaStar, FaStore,
  FaChevronDown, FaArrowLeft, FaRupeeSign, FaShieldAlt, FaTimes
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";

export default function ProductDetails() {
  // 🆔 GET PRODUCT ID: From URL parameters
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 👤 USER INFO: Get logged-in user data
  const { userInfo } = useSelector((state) => state.auth);

  // 📦 FETCH DATA: Get product details and categories
  const { data: categories } = useFetchCategoriesQuery();
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  // 🔄 REVIEW ACTIONS: Functions to create, update, delete reviews
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // 🏷️ PRODUCT INFO: Get category name and handle cart
  const productCategoryName = product?.category?.name
    ? product.category.name
    : categories?.data?.find(c => c._id === (product?.category?._id || product?.category))?.name || "General";

  const addToCartHandler = () => showError(`Added ${qty} items to cart!`);

  // 🖱️ CLICK OUTSIDE: Close dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⏳ LOADING & ERROR: Show loading or error states
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#0d1117]"><Loader /></div>;
  if (error) return <div className="p-10 text-center"><Message variant="danger">{error?.data?.message || error.message}</Message></div>;

  return (
    <div className="w-full min-h-screen  bg-gradient-to-b from-[#030712] via-slate-950 to-black text-white selection:bg-pink-500/30">
      {/* 🎨 CUSTOM STYLES: Scrollbar and background animations */}
      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 2px; height: 2px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: #db2777; border-radius: 10px; }
        @keyframes ambient { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
        .animate-ambient { animation: ambient 6s infinite ease-in-out; }
      `}</style>

      {/* 🖼️ IMAGE POPUP: Full-size image viewer */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1117]/95 backdrop-blur-md" onClick={() => setIsImageModalOpen(false)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-pink-500 text-3xl transition-colors"><FaTimes /></button>
          <div className="relative bg-[#161b22] border border-white/10 p-4 rounded-[2rem] shadow-2xl max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <img src={product.image} alt="Preview" className="w-auto h-auto max-w-[800px] max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      <div className="lg:pl-[80px] w-full max-w-[1400px] mx-auto px-6 py-12">
        {/* 🔙 BACK BUTTON: Return to previous page */}
        <Link to="/" className="group inline-flex items-center gap-3 bg-[#161b22] border border-white/10 px-5 py-2 rounded-full text-sm font-bold text-white/60 hover:text-white transition-all mb-10 shadow-lg"><FaArrowLeft /> Back</Link>

        {/* 📱 MAIN LAYOUT: Product image and info side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* 🖼️ LEFT SIDE: Product image with zoom */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative h-[450px] md:h-[550px] lg:h-[650px] flex items-center justify-center group cursor-zoom-in" onClick={() => setIsImageModalOpen(true)}>
              <div className="absolute inset-0 bg-pink-600/10 blur-[120px] rounded-full animate-ambient"></div>
              <div className="absolute top-8 left-8 z-10 flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <FaBox className="text-pink-500 z-10 text-xs" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{product.brand}</span>
              </div>
              <img src={product.image} alt={product.name} className="max-h-[80%] max-w-[80%] object-contain z-10 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-8 right-8 scale-150 z-20" onClick={(e) => e.stopPropagation()}><HeartIcon product={product} /></div>
            </div>
          </div>

          {/* 📋 RIGHT SIDE: Product details and purchase options */}
          <div className="lg:col-span-5 flex flex-col items-start pt-2">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">{product.name}</h1>
            <div className="flex items-center text-4xl md:text-5xl font-black text-gray-500 mb-10 h-12">
              <FaRupeeSign className="text-2xl md:text-3xl mr-1 translate-y-[2px]" />{product.price}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              {[
                { icon: <FaStore />, label: "Brand", value: product.brand, color: "text-blue-400" },
                { icon: <FaStar />, label: "Reviews", value: product.numReviews, color: "text-amber-400" },
                { icon: <FaBox />, label: "Stock", value: product.countInStock > 0 ? "In Stock" : "Sold Out", color: "text-emerald-500" },
                { icon: <FaClock />, label: "Added", value: moment(product.createdAt).fromNow(), color: "text-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem] flex items-center gap-4">
                  <div className={`${stat.color} text-xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl`}>{stat.icon}</div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] uppercase font-bold text-white/30 tracking-widest">{stat.label}</p>
                    <p className="font-bold text-sm truncate">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🛒 PURCHASE SECTION: Quantity selector and add to cart */}
            {product.countInStock > 0 && (
              <div className="flex items-center gap-4 w-full p-2 bg-[#161b22] border border-white/5 rounded-[2rem] shadow-2xl">
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between px-6 h-[65px] bg-[#0d1117] rounded-[1.5rem] min-w-[130px] font-bold text-gray-400 text-sm">Qty: {qty} <FaChevronDown /></button>
                  {isDropdownOpen && (
                    <ul className="absolute bottom-[115%] w-full bg-[#1a1f26] border border-white/10 rounded-2xl overflow-y-auto max-h-40 z-50 custom-scrollbar-thin shadow-2xl">
                      {[...Array(product.countInStock).keys()].map(x => (
                        <li key={x+1} onClick={() => {setQty(x+1); setIsDropdownOpen(false)}} className="p-4 text-center hover:bg-pink-600 cursor-pointer text-sm font-bold transition-colors">{x+1}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button onClick={addToCartHandler} className="flex-1 bg-pink-600 hover:bg-pink-700 h-[65px] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-all"><FaShoppingCart className="inline mr-2"/> Add To Cart</button>
              </div>
            )}
            {/* ⭐ PRODUCT RATING: Overall customer score */}
            <div className="mt-10 px-2"><Ratings value={product.rating} text="Verified Score" /></div>
          </div>
        </div>

        {/* 💬 REVIEWS & RECOMMENDATIONS: Customer feedback and similar products */}
        <div className="pt-10 border-t border-white/5">
          <ProductTabs
            product={product} 
            userInfo={userInfo} 
            refetch={refetch}
            createReview={createReview}
            updateReview={updateReview}
            deleteReview={deleteReview}
            loadingReview={loadingReview}
          />
        </div>
      </div>
    </div>
  );
}