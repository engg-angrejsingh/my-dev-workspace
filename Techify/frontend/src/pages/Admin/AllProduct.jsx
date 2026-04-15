import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaEdit, FaTimes, FaHashtag, FaRupeeSign } from "react-icons/fa";
import { BiLayer } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import MotionBackground from "../../components/Animation/MotionBackground";

const AllProduct = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const formatProductDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) return <Loader />;
  if (isError || !products) return <div className="text-white p-10 font-mono">SYSTEM_LINK_FAILURE</div>;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center overflow-x-hidden relative">
      <style>{`
        .cyber-header {
          background: linear-gradient(to right, #ff007f, #9333ea, #00f2ff, #9333ea, #ff007f);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rgb-wave 4s linear infinite;
        }
        @keyframes rgb-wave { to { background-position: 200% center; } }
      `}</style>

      <MotionBackground />

      <div className="w-[70vw] mt-16 pl-24 pr-6 relative z-10 flex flex-col">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 border-b border-white/10 pb-10">
          <div className="text-left">
            <h1 className="text-4xl font-black uppercase tracking-[0.4rem] cyber-header">
              Products
            </h1>
          </div>

          <div className="w-full lg:w-[450px]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]" />
              Search Product
            </h2>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 focus-within:border-pink-500 transition-all">
              <div className="pl-4 text-pink-500"><FaSearch size={14} /></div>
              <input
                className="flex-1 bg-transparent py-3 px-4 outline-none text-white text-sm placeholder-slate-500 font-bold uppercase tracking-wider border-none focus:ring-0"
                placeholder="Search Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pr-4 border-l border-white/10 ml-2 pl-4 flex items-center gap-3">
                <BiLayer className="text-pink-500" size={20} />
                <div className="flex flex-col items-center relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Total</span>
                  <span className="text-sm font-mono font-bold text-pink-500 leading-none">
                    {filteredProducts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE POPUP */}
        <AnimatePresence>
          {selectedImageUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedImageUrl(null)} className="absolute inset-0 bg-black/80" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-slate-950 border border-white/10 p-4 rounded-[2.5rem] max-w-4xl w-full shadow-2xl flex flex-col items-center">
                <button onClick={() => setSelectedImageUrl(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition">
                  <FaTimes size={24} />
                </button>
                <div className="w-full h-full max-h-[70vh] flex justify-center items-center overflow-hidden rounded-3xl bg-black/40">
                  <img src={selectedImageUrl} className="max-h-[65vh] w-auto object-contain" alt="Preview" />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-24">
          {filteredProducts.map((product) => {
            const fullImageUrl = product.image || '/placeholder.png';
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product._id} 
                className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md group hover:border-pink-500/50 transition-all flex flex-col shadow-xl"
              >
                {/* 1. DATE: At the very top right, clean and subtle */}
                <div className="w-full text-center mb-2">
                  <span className="text-[10px] font-mono font-bold text-pink-500 uppercase tracking-widest">
                    {formatProductDate(product.createdAt || product.updatedAt)}
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative aspect-square mb-6 bg-black/30 rounded-[2rem] overflow-hidden p-6 flex items-center justify-center border border-white/5">
                  <img 
                    src={fullImageUrl} 
                    onClick={() => setSelectedImageUrl(fullImageUrl)}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 cursor-pointer" 
                    alt={product.name} 
                  />
                  <div className="absolute top-4 right-4 bg-pink-600/90 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <FaRupeeSign className="text-[9px]" />{product.price}
                  </div>
                </div>

                <div className="flex-grow flex flex-col">
                  {/* 2. NAME & ID: Grouped horizontally for a modern look */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors uppercase truncate pr-2">
                      {product.name}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-tighter shrink-0">
                      <FaHashtag className="inline mr-1" />{product._id?.substring(18)}
                    </p>
                  </div>

                  {/* 3. DESCRIPTION: Middle-focused, easy to read */}
                  <p className="text-slate-400 text-xs line-clamp-2 mb-6 italic leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* 4. BUTTON: Solid anchor at bottom */}
                  <Link 
                    to={`/admin/product/update/${product._id}`} 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-xl mt-auto"
                  >
                    <FaEdit /> Modify Product
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;