import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { showSuccess, showError } from "../../utils/toast"; // Using your custom toasts
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiFileList3Line, RiPriceTag3Line, RiHashtag } from "react-icons/ri";
import { MdOutlineCategory, MdOutlineInventory2, MdOutlineBrandingWatermark } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FiPackage, FiChevronDown, FiTrash2, FiSave, FiAlertTriangle, FiX, FiArrowLeft } from "react-icons/fi";

import MotionBackground from "../../components/Animation/MotionBackground";
import Loader from "../../components/Loader";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const productId = params._id || params.id;
  const { data: productData, isLoading: loadingProduct, isFetching: fetchingProduct } = useGetProductByIdQuery(productId, { skip: !productId });
  const { data: categoriesResponse = {} } = useFetchCategoriesQuery();
  const categories = categoriesResponse.data || [];

  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Form States
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null); 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("Select Category");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price ?? "");
      setCategory(productData.category?._id || productData.category || "");
      setQuantity(productData.quantity ?? "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock ?? "");
      
      const currentCat = categories.find(c => c._id === (productData.category?._id || productData.category));
      if (currentCat) setCategoryName(currentCat.name);
      
      setImageUrl(productData.image ? (productData.image.startsWith("http") ? productData.image : productData.image) : null);
    }
  }, [productData, categories]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadProductImage(formData).unwrap();
        setImage(res.image);
        setImageUrl(URL.createObjectURL(file));
        showSuccess("Visual data synced to buffer");
      } catch (err) {
        showError("Image upload failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        image, name, description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
      };
      await updateProduct({ productId, formData: updatedData }).unwrap();
      showSuccess(`${name} updated successfully! 🚀`);
      navigate("/admin/allproducts");
    } catch (err) {
      showError(err?.data?.message || "Protocol update failed.");
    }
  };

  const confirmDeleteHandler = async () => {
    try {
      await deleteProduct(productId).unwrap();
      showSuccess("Record purged from registry");
      navigate("/admin/allproducts");
    } catch (err) {
      showError("Termination failed.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loadingProduct || fetchingProduct) return <Loader />;

  return (
    <>
      <MotionBackground />
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ec4899; border-radius: 10px; }
      `}</style>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#080b14] border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl text-center">
              <FiAlertTriangle size={40} className="text-rose-500 mx-auto mb-4" />
              <h2 className="text-xl font-black uppercase mb-2">Delete Record?</h2>
              <p className="text-slate-400 text-sm mb-8">Erase <span className="text-white font-bold">"{name}"</span> permanently?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold uppercase text-[10px] text-white">Cancel</button>
                <button onClick={confirmDeleteHandler} className="flex-1 py-3 bg-rose-600 rounded-xl font-bold uppercase text-[10px] text-white">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen p-4 lg:p-10 flex justify-center items-center">
        <div className="w-full max-w-6xl bg-transparent backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-visible">
          
          {/* LEFT: Image Preview */}
          <div className="lg:w-1/2 w-full p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02] rounded-t-[2.5rem] lg:rounded-l-[2.5rem]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <FiPackage className="text-pink-500" /> Visual Preview
            </h2>

            <label className="relative w-full h-[400px] lg:h-[550px] rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden bg-black/40 group border-white/20 hover:border-pink-500">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="preview" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <p className="text-white font-bold bg-pink-600 px-6 py-3 rounded-xl">Change Media</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <AiOutlineCloudUpload className="text-8xl text-gray-600 group-hover:text-pink-500 transition-colors mx-auto" />
                  <p className="text-gray-100 font-bold text-lg">Choose Image</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* RIGHT: Form Section */}
          <div className="lg:w-1/2 w-full p-8 lg:p-12 space-y-8 overflow-visible">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white tracking-tight uppercase">Update Product</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider italic">ID: {productId.substring(0,8)}...</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Name", icon: <RiFileList3Line />, val: name, set: setName, type: "text" },
                  { label: "Brand", icon: <MdOutlineBrandingWatermark />, val: brand, set: setBrand, type: "text" },
                  { label: "Price", icon: <RiPriceTag3Line />, val: price, set: setPrice, type: "number" },
                  { label: "Quantity", icon: <RiHashtag />, val: quantity, set: setQuantity, type: "number" },
                  { label: "In Stock", icon: <MdOutlineInventory2 />, val: stock, set: setStock, type: "number" }
                ].map((f, i) => (
                  <div key={i} className="group space-y-1">
                    <label className="text-[11px] uppercase text-gray-300 font-black ml-1 tracking-widest">{f.label}</label>
                    <div className="flex items-center bg-black/40 border border-white/20 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-pink-500/50 transition-all h-[46px]">
                      <span className="text-gray-400 text-lg">{f.icon}</span>
                      <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full p-3 bg-transparent outline-none text-sm text-white font-bold" required />
                    </div>
                  </div>
                ))}
                
                {/* Custom Category Dropdown */}
                <div className="group space-y-1 relative" ref={dropdownRef}>
                  <label className="text-[11px] uppercase text-gray-300 font-black ml-1 tracking-widest">Category</label>
                  <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center justify-between bg-black/40 border border-white/20 rounded-2xl px-4 cursor-pointer focus-within:ring-2 focus-within:ring-pink-500/50 transition-all h-[46px]">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MdOutlineCategory className="text-gray-400 text-lg flex-shrink-0" />
                      <span className="text-sm font-bold truncate text-white">{categoryName}</span>
                    </div>
                    <FiChevronDown className={`transition-transform duration-300 text-slate-500 flex-shrink-0 ${showDropdown ? "rotate-180" : ""}`} />
                  </div>
                  {showDropdown && (
                    <div className="absolute bottom-[100%] left-0 mb-2 w-full bg-zinc-900/95 border border-white/10 shadow-2xl z-[100] max-h-52 overflow-y-auto backdrop-blur-xl custom-scrollbar rounded-2xl">
                      {categories?.map((c) => (
                        <div key={c._id} onClick={() => { setCategory(c._id); setCategoryName(c.name); setShowDropdown(false); }} className="px-5 py-3 uppercase text-sm font-bold text-gray-200 hover:bg-pink-600 transition-colors cursor-pointer">
                          {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="group space-y-1">
                <label className="text-[11px] uppercase text-gray-300 font-black ml-1 tracking-widest">Description</label>
                <div className="flex items-start bg-black/40 border border-white/20 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-pink-500/50 transition-all">
                  <HiOutlinePencilSquare className="text-gray-400 text-lg mt-3" />
                  <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-transparent h-24 outline-none text-sm text-white resize-none font-bold" required />
                </div>
              </div>

              {/* ACTION BUTTONS GROUP */}
              <div className="flex flex-wrap gap-4 pt-4">
                {/* UPDATE BUTTON */}
                <button type="submit" disabled={isUpdating} className="flex-[2] min-w-[150px] h-[54px] rounded-2xl font-black text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 shadow-lg shadow-pink-500/20 transition-all active:scale-[0.97]">
                  <FiSave className="inline mr-2" /> {isUpdating ? "Syncing..." : "Update Product"}
                </button>
                

                {/* DELETE BUTTON */}
                <button 
                  type="button" 
                  onClick={() => setShowDeleteModal(true)} 
                  className="w-[54px] h-[54px] rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                >
                  <FiTrash2 size={20} className="mx-auto" />
                </button>
              </div>
                {/* CANCEL / BACK BUTTON */}
                <button 
                  type="button" 
                  onClick={() => navigate("/admin/allproducts")} 
                  className="flex-1 min-w-[100px] h-[54px] rounded-2xl w-full bg-white/5 border border-white/10 text-gray-300 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  <FiArrowLeft className="inline mr-1" /> Back
                </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;