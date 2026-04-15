import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { showSuccess, showError } from "../../utils/toast";

// Background & Icons
import MotionBackground from "../../components/Animation/MotionBackground"; 
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiFileList3Line, RiPriceTag3Line, RiHashtag } from "react-icons/ri";
import { MdOutlineCategory, MdOutlineInventory2, MdOutlineBrandingWatermark } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FiPackage, FiChevronDown } from "react-icons/fi";

const ProductList = () => {
  const navigate = useNavigate();
  
  // State for image handling
  const [imageFile, setImageFile] = useState(null); 
  const [imageUrl, setImageUrl] = useState(null);   
  
  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("Select Category");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // API Hooks
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Local Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); 
    }
  };

  //Main Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) return showError("Please select a product image");
    if (!category) return showError("Please select a category");

    try {
      //Upload the image
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);
      const uploadRes = await uploadProductImage(imgFormData).unwrap();
      const serverImagePath = uploadRes.image; 

      //Create the product
      const productData = new FormData();
      productData.append("image", serverImagePath);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const result = await createProduct(productData).unwrap();

      if (result.error) {
        showError(result.error);
      } else {
        showSuccess(`${result.name} created successfully! 🚀`);
        
        // CLEAR FIELDS 
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setCategoryName("Select Category");
        setQuantity("");
        setBrand("");
        setStock(0);
        setImageFile(null);
        setImageUrl(null);
      }
    } catch (error) {
      showError(error?.data?.message || "Check your fields and try again.");
    }
  };

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

      <div className="relative z-10 min-h-screen p-4 lg:p-10 flex justify-center items-center">
        <div className="w-full max-w-6xl bg-transparent backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-visible">
          
          {/* LEFT SIDE: Image Preview */}
          <div className="lg:w-1/2 w-full p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] rounded-t-[2.5rem] lg:rounded-l-[2.5rem]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <FiPackage className="text-pink-500" /> Product Preview
            </h2>

            <label className={`relative w-full h-[400px] lg:h-[550px] rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden bg-white dark:bg-black/40 group ${imageUrl ? "border-pink-500" : "border-gray-300 dark:border-white/20 hover:border-pink-500"}`}>
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white font-bold bg-pink-600 px-6 py-3 rounded-xl">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <AiOutlineCloudUpload className="text-8xl text-gray-300 dark:text-gray-600 group-hover:text-pink-500 transition-colors mx-auto" />
                  <p className="text-slate-800 dark:text-gray-100 font-bold text-lg">Click to select image</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="lg:w-1/2 w-full p-8 lg:p-12 space-y-8 overflow-visible">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">New Product</h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Inventory Entry</p>
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
                    <label className="text-[11px] uppercase text-slate-700 dark:text-gray-300 font-black ml-1 tracking-widest">{f.label}</label>
                    <div className="flex items-center bg-white dark:bg-black/40 border border-gray-300 dark:border-white/20 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-pink-500/50 transition-all shadow-sm">
                      <span className="text-slate-500 dark:text-gray-400 text-lg">{f.icon}</span>
                      <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.label} className="w-full p-3 bg-transparent outline-none text-sm text-slate-900 dark:text-white font-bold" required />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="group space-y-1">
                <label className="text-[11px] uppercase text-slate-700 dark:text-gray-300 font-black ml-1 tracking-widest">Description</label>
                <div className="flex items-start bg-white dark:bg-black/40 border border-gray-300 dark:border-white/20 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-pink-500/50 transition-all shadow-sm">
                  <HiOutlinePencilSquare className="text-slate-500 dark:text-gray-400 text-lg mt-3" />
                  <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." className="w-full p-3 bg-transparent h-32 outline-none text-sm text-slate-900 dark:text-white resize-none font-bold" required />
                </div>
              </div>

              {/* ✨ CUSTOM CATEGORY SELECT ✨ */}
              <div className="group space-y-1 relative" ref={dropdownRef}>
                <label className="text-[11px] uppercase text-slate-700 dark:text-gray-300 font-black ml-1 tracking-widest">Category</label>
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-between bg-white dark:bg-black/40 border border-gray-300 dark:border-white/20 rounded-2xl px-4 cursor-pointer focus-within:ring-2 focus-within:ring-pink-500/50 transition-all shadow-sm h-[46px]"
                >
                  <div className="flex items-center gap-2">
                      <MdOutlineCategory className="text-slate-500 dark:text-gray-400 text-lg" />
                      <span className={`text-sm font-bold truncate ${category ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                          {categoryName}
                      </span>
                  </div>
                  <FiChevronDown className={`transition-transform duration-300 text-slate-500 ${showDropdown ? "rotate-180" : ""}`} />
                </div>

                {showDropdown && (
                  <div className="absolute bottom-[100%] left-0 mb-2 w-full bg-white/95 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-2xl z-[100] max-h-52 overflow-y-auto backdrop-blur-xl custom-scrollbar rounded-2xl">
                    {categories?.data?.map((c) => (
                      <div 
                        key={c._id}
                        onClick={() => {
                          setCategory(c._id);
                          setCategoryName(c.name);
                          setShowDropdown(false);
                        }}
                        className="px-5 py-3 uppercase text-sm font-bold text-slate-700 dark:text-gray-200 hover:bg-pink-600 hover:text-white cursor-pointer transition-colors"
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isCreating || isUploading}
                className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 shadow-lg shadow-pink-500/20 transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {isUploading ? "Uploading Image..." : isCreating ? "Creating Product..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;