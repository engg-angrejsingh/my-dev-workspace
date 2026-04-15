import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaSearch,
  FaExclamationTriangle,
  FaTimes,
  FaHashtag,
} from "react-icons/fa";
import { BiLayer } from "react-icons/bi"; 
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../utils/toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import Message from "../../components/Message";
import MotionBackground from "../../components/Animation/MotionBackground";
import CategoryForm from "../../components/CategoryForm";

const CategoryList = () => {
  const { data: categories, isLoading, error, refetch } = useFetchCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [editableId, setEditableId] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const categoryArray = Array.isArray(categories?.data) ? categories.data : [];
  const filteredCategories = categoryArray.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (editableId && categoryArray.length > 0) {
      const categoryToEdit = categoryArray.find((c) => c._id === editableId);
      if (categoryToEdit) setEditableName(categoryToEdit.name);
    }
  }, [editableId, categoryArray]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    try {
      await createCategory({ name: trimmedName }).unwrap();
      showSuccess("Category Created");
      setName("");
      refetch(); 
    } catch (err) {
      showError(err?.data?.message || "Creation Failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateCategory({
        categoryId: id,
        updatedCategory: { name: editableName },
      }).unwrap();
      setEditableId(null);
      showSuccess("Updated");
      refetch();
    } catch (err) {
      showError("Update Failed");
    }
  };

  const confirmDeleteHandler = async () => {
    try {
      await deleteCategory(itemToDelete._id).unwrap();
      showSuccess("Category Deleted");
      setShowDeleteModal(false);
      setItemToDelete(null);
      refetch();
    } catch (err) {
      showError("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center overflow-x-hidden relative">
      <style>{`
        .body-scrollbar::-webkit-scrollbar { width: 4px; }
        .body-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.3); border-radius: 10px; }
        
        .cyber-header {
          background: linear-gradient(to right, #ff007f, #9333ea, #00f2ff, #9333ea, #ff007f);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rgb-wave 4s linear infinite;
        }
        @keyframes rgb-wave { to { background-position: 200% center; } }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <MotionBackground />

      {/* CONTAINER: Locked to 70vw and pl-24 for sidebar clearance */}
      <div className="w-[70vw] mt-16 pl-24 pr-6 relative z-10 flex flex-col items-start">
        
        {/* HEADER SECTION: Text Left */}
        <div className="mb-12 text-left w-full">
          <h1 className="text-4xl font-black uppercase tracking-[0.6rem] cyber-header">Categories</h1>
          <p className="text-[10px] text-pink-500 font-bold tracking-[0.3em] uppercase mt-1">Classification Management</p>
        </div>

        {/* MANAGEMENT BAR: New Record Left | Search Right */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-16 w-full">
          {/* Left Side: Create Form */}
          <div className="w-full lg:w-fit lg:min-w-[450px]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]" />
              Initialize New Record
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-[1.5rem] w-full">
               <CategoryForm value={name} setValue={setName} handleSubmit={handleCreate} />
            </div>
          </div>

          {/* Right Side: Search & Total Badge */}
          <div className="w-full lg:w-[400px]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 text-right lg:text-left">Network Search</h2>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 focus-within:border-pink-500 transition-all">
              <div className="pl-4 text-pink-500"><FaSearch size={14} /></div>
              <input
                className="flex-1 bg-transparent py-3 px-4 outline-none text-white text-sm placeholder-slate-500 font-bold uppercase tracking-wider border-none focus:ring-0"
                placeholder="SEARCH DATABASE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pr-4 border-l border-white/10 ml-2 pl-4 flex items-center gap-3">
                <BiLayer className="text-pink-500" size={20} />
                <div className="flex flex-col items-center relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Total</span>
                  <span className="text-sm font-mono font-bold text-pink-500 leading-none">{categoryArray.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="w-full pb-24">
          {isLoading ? <Loader /> : error ? <Message variant="error">Connection Interrupted</Message> : (
            <div className="relative bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden h-[55vh] flex flex-col shadow-2xl">
              <div className="shrink-0 bg-slate-900/80 border-b border-white/10">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-widest font-black text-slate-200">
                      <th className="px-12 py-6 w-[35%]">Unique Serial</th>
                      <th className="px-10 py-6 w-[45%]">Category Name</th>
                      <th className="px-10 py-6 text-right w-[20%] pr-14">Options</th>
                    </tr>
                  </thead>
                </table>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar body-scrollbar">
                <table className="w-full text-left table-fixed border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className="group relative hover:bg-white/[0.04] transition-all duration-300">
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <td className="px-12 py-6 font-mono text-[10px] text-slate-500 w-[35%] lowercase truncate">
                           <FaHashtag className="inline mr-1 opacity-40" /> {category._id}
                        </td>
                        <td className="px-10 py-6 w-[45%]">
                          {editableId === category._id ? (
                            <div className="flex items-center gap-4">
                              <input
                                autoFocus value={editableName}
                                onChange={(e) => setEditableName(e.target.value)}
                                className="bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-2 text-sm text-white outline-none font-bold w-full uppercase tracking-widest"
                              />
                              <div className="flex gap-2">
                                <FaCheck className="text-green-500 cursor-pointer hover:scale-125 transition" onClick={() => handleUpdate(category._id)} />
                                <FaTimes className="text-rose-500 cursor-pointer hover:scale-125 transition" onClick={() => setEditableId(null)} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="text-base font-black text-slate-200 group-hover:text-white uppercase tracking-tighter transition-colors">{category.name}</span>
                              <FaEdit className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-pink-400 cursor-pointer text-[12px] transition-all" onClick={() => setEditableId(category._id)} />
                            </div>
                          )}
                        </td>
                        <td className="px-10 py-6 text-right w-[20%] pr-14">
                          <button 
                            onClick={() => { setItemToDelete(category); setShowDeleteModal(true); }} 
                            className="p-3 rounded-2xl bg-rose-500/10 text-rose-500/60 hover:text-white hover:bg-rose-600 transition-all shadow-xl"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/90" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] max-w-sm w-full shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <FaExclamationTriangle size={32} className="text-rose-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Confirm Deletion</h3>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-bold">
                  Are you sure you want to remove <br/>
                  <span className="text-rose-400 uppercase tracking-widest text-lg font-black italic">"{itemToDelete?.name}"</span>?
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black transition-all uppercase tracking-widest border border-white/5">Abort</button>
                <button onClick={confirmDeleteHandler} className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all uppercase tracking-widest shadow-lg shadow-rose-600/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;