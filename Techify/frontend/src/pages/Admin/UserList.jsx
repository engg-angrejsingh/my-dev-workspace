import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserShield,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiLayer } from "react-icons/bi"; 
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../utils/toast";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import MotionBackground from "../../components/Animation/MotionBackground";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("user"); 
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.includes(searchTerm);
    
    const matchesToggle = viewMode === "user" ? !user.isAdmin : user.isAdmin;
    return matchesSearch && matchesToggle;
  });

  const confirmDeleteHandler = async () => {
    try {
      await deleteUser(userToDelete._id).unwrap();
      showSuccess("User is removed");
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      showError(err?.data?.message || err.error);
    }
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      setEditableUserId(null);
      showSuccess("Successfully updated");
      refetch();
    } catch (err) {
      showError(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center overflow-x-hidden relative">
      <style>{`
        .body-scrollbar::-webkit-scrollbar { width: 4px; }
        .body-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
        
        .cyber-header {
          background: linear-gradient(to right, #ff007f, #9333ea, #00f2ff, #9333ea, #ff007f);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rgb-wave 4s linear infinite;
        }

        .user-row {
          position: relative;
          transition: all 0.2s ease;
        }

        .user-row::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: white;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .user-row:hover::before {
          opacity: 1;
        }

        @keyframes rgb-wave { to { background-position: 200% center; } }
      `}</style>

      <MotionBackground />

      {/* CONTAINER FIX: 
          - Changed w-full to w-[70vw]
          - Added pl-24 to clear sidebar
          - Changed items-center to items-start for left alignment
      */}
      <div className="w-[70vw] mt-12 pl-24 pr-6 relative z-10 flex flex-col items-start">
        
        {/* HEADER: Moved text-center to text-left */}
        <div className="mb-10 text-left w-full">
          <h1 className="text-4xl font-black uppercase tracking-[0.6rem] cyber-header">User Management</h1>
          <p className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase mt-1">Authorized Access Only</p>
        </div>

        {/* MANAGEMENT BAR: Toggles on left | Search & Total on right */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-12 w-full">
          <div className="w-full lg:w-fit lg:min-w-[450px]">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]" />
              Filter Access Level
            </h2>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-1.5 rounded-[1.5rem] flex items-center w-full lg:w-fit">
                <button 
                  onClick={() => setViewMode("user")}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "user" ? "bg-white/10 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <FaUsers size={14} /> Users
                </button>
                <button 
                  onClick={() => setViewMode("admin")}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "admin" ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <FaUserShield size={14} /> Admins
                </button>
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Search</h2>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 focus-within:border-cyan-400 transition-all">
              <div className="pl-4 text-cyan-400"><FaSearch size={14} /></div>
              <input
                className="flex-1 bg-transparent py-3 px-4 outline-none text-white text-sm placeholder-slate-500 font-bold uppercase tracking-wider border-none focus:ring-0"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pr-4 border-l border-white/10 ml-2 pl-4 flex items-center gap-3">
                <BiLayer className="text-cyan-400" size={20} />
                <div className="flex flex-col items-center relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Total</span>
                  <span className="text-sm font-mono font-bold text-cyan-400 leading-none">{filteredUsers?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="w-full pb-20">
          {isLoading ? <Loader /> : error ? <Message variant="error">System Link Failure</Message> : (
            <div className="relative bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden h-[60vh] flex flex-col shadow-2xl">
              <div className="shrink-0 bg-slate-900/80 border-b border-white/10">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-widest font-black text-slate-200">
                      <th className="px-10 py-5 w-[25%]">Serial ID</th>
                      <th className="px-10 py-5 w-[25%]">Username</th>
                      <th className="px-10 py-5 w-[25%]">Email</th>
                      <th className="px-4 py-5 text-center w-[12%]">Role</th>
                      <th className="px-4 py-5 text-center w-[13%]">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="flex-1 overflow-y-auto body-scrollbar">
                <table className="w-full text-left table-fixed border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers?.map((user) => (
                      <tr key={user._id} className="user-row group hover:bg-white/[0.04]">
                        <td className="px-10 py-5 font-mono text-[9px] text-slate-500 w-[25%] lowercase truncate">{user._id}</td>
                        <td className="px-10 py-5 w-[25%]">
                          {editableUserId === user._id ? (
                            <input
                              autoFocus value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="bg-cyan-500/10 border border-cyan-500/30 rounded px-2 py-1 text-xs text-white outline-none font-bold w-full uppercase"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-200 group-hover:text-white uppercase tracking-wide">{user.username}</span>
                              {!user.isAdmin && (
                                <FaEdit className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-400 cursor-pointer text-[10px] transition" 
                                  onClick={() => {
                                    setEditableUserId(user._id);
                                    setEditableUserName(user.username);
                                    setEditableUserEmail(user.email);
                                  }} 
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-10 py-5 w-[25%] truncate text-slate-400 group-hover:text-slate-300 transition-colors">
                          {editableUserId === user._id ? (
                            <input value={editableUserEmail} onChange={(e) => setEditableUserEmail(e.target.value)} className="bg-cyan-500/10 border border-cyan-500/30 rounded px-2 py-1 text-xs text-white outline-none w-full" />
                          ) : ( user.email )}
                        </td>
                        <td className="px-4 py-5 text-center w-[12%]">
                           {user.isAdmin ? (
                              <span className="text-[9px] text-cyan-400 border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 rounded-full font-black">ADMIN</span>
                            ) : (
                              <span className="text-[9px] text-slate-500 border border-white/5 bg-white/5 px-3 py-1 rounded-full font-black">USER</span>
                            )}
                        </td>
                        <td className="px-4 py-5 text-center w-[13%]">
                          <div className="flex justify-center gap-4">
                             {editableUserId === user._id ? (
                              <>
                                <FaCheck className="text-green-500 cursor-pointer" onClick={() => updateHandler(user._id)} />
                                <FaTimes className="text-rose-500 cursor-pointer" onClick={() => setEditableUserId(null)} />
                              </>
                            ) : user.isAdmin ? (
                              <FaUserShield className="text-cyan-400/20" size={16} />
                            ) : (
                              <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500/60 hover:text-white hover:bg-rose-600 transition-all">
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
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

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/80" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-slate-900 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
                  <FaExclamationTriangle size={28} className="text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Confirm Delete</h3>
                <div className="text-left text-xs bg-black/20 p-4 rounded-xl border border-white/5 space-y-2 mb-8">
                    <p className="text-slate-400">ID: <span className="text-rose-400">{userToDelete?._id}</span></p>
                    <p className="text-slate-400">Name: <span className="text-white">{userToDelete?.username}</span></p>
                    <p className="text-slate-400">Email: <span className="text-cyan-400">{userToDelete?.email}</span></p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all uppercase tracking-widest border border-white/5">Cancel</button>
                <button onClick={confirmDeleteHandler} className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all uppercase tracking-widest">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;