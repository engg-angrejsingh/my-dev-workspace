import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserShield,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../utils/toast";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import ShootingStarBackground from "../../components/Animation/ShootingStarBackground";

const UserList = () => {
  // 🛰️ API Queries & Mutations
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // 📝 Local State for Editing & Searching
  const [searchTerm, setSearchTerm] = useState("");
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // 🛡️ Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // 🔄 Sync with database on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 🔍 Filter Logic (Matches ID, Name, or Email)
  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.includes(searchTerm),
  );

  // 🗑️ Delete Confirmation Handler
  const confirmDeleteHandler = async () => {
    try {
      await deleteUser(userToDelete._id).unwrap();
      showSuccess("✅ User is removed");
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      showError(`❌ ${err?.data?.message || err.error}`);
    }
  };

  // 💾 Update Logic with Validation
  const updateHandler = async (id) => {
    // 🏷️ Name Validation: No numbers allowed
    const nameHasNumbers = /\d/.test(editableUserName);
    
    // 📧 Email Validation: Must end with @gmail.com
    const isGmail = editableUserEmail.toLowerCase().endsWith("@gmail.com");

    if (nameHasNumbers) {
      return showError("⚠️ Name must not contain numbers");
    }

    if (!isGmail) {
      return showError("⚠️ Only @gmail.com addresses are authorized");
    }

    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      setEditableUserId(null);
      showSuccess("⚙️ Successfully updated");
      refetch();
    } catch (err) {
      showError(`⚠️ ${err?.data?.message || err.error}`);
    }
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center overflow-hidden">
      <style>{`
        .body-scrollbar::-webkit-scrollbar { width: 1.5px; }
        .body-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22d3ee, #d946ef);
          border-radius: 10px;
        }
        @keyframes scan-text {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-scan {
          background: linear-gradient(to right, #22d3ee 15%, #ffffff 45%, #ffffff 55%, #d946ef 85%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: scan-text 5s linear infinite;
          display: inline-block;
        }
      `}</style>

      <ShootingStarBackground>
        <div className="w-full max-w-6xl mt-16 text-center shrink-0 px-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h1
              className="text-5xl opacity-[0.8] font-black uppercase animate-scan leading-none pb-1"
              style={{ letterSpacing: "0.2em" }}
            >
              User Management
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold opacity-70 tracking-[0.5em]">
              Authorized Access
            </p>
          </div>

          <div className="relative max-w-xl mx-auto mt-12 mb-10 group">
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 blur-[2px]"></div>
            <div className="relative flex items-center bg-slate-950/90 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 group-focus-within:border-transparent transition-all">
              <FaSearch className="text-gray-500 mr-4 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Query system registry..."
                className="bg-transparent w-full outline-none text-sm placeholder-gray-800 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error?.data?.message}</Message>
        ) : (
          <div className="flex justify-center w-full px-4 pb-12">
            <div className="max-w-6xl w-full max-h-[60vh] bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
              <div className="shrink-0 bg-slate-900/60 border-b border-white/10">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="text-gray-400 text-[10px] uppercase tracking-[3px] font-black">
                      <th className="px-10 py-6 text-left w-[25%]">User ID</th>
                      <th className="px-10 py-6 text-left w-[20%]">Name</th>
                      <th className="px-10 py-6 text-left w-[25%]">
                        Email Identity
                      </th>
                      <th className="px-4 py-6 text-center w-[15%]">
                        Clearance
                      </th>
                      <th className="px-4 py-6 text-center w-[15%]">
                        Protocol
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="overflow-y-auto overflow-x-hidden body-scrollbar flex-1">
                <table className="w-full table-fixed">
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-cyan-500/[0.03] transition-colors group"
                      >
                        <td className="px-10 py-5 font-mono text-[10px] text-gray-600 w-[25%] truncate text-left">
                          {user._id}
                        </td>
                        <td className="px-10 py-5 w-[20%] text-left">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={editableUserName}
                              className="bg-black/50 border border-cyan-500/50 rounded px-2 py-1 text-cyan-400 outline-none w-full text-xs"
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-200">
                                {user.username}
                              </span>
                              {!user.isAdmin && (
                                <FaEdit
                                  className="text-gray-600 hover:text-cyan-400 cursor-pointer text-[10px] transition"
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
                        <td className="px-10 py-5 text-gray-400 text-xs w-[25%] text-left truncate">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={editableUserEmail}
                              className="bg-black/50 border border-cyan-500/50 rounded px-2 py-1 text-cyan-400 outline-none w-full text-xs"
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-4 py-5 text-center w-[15%]">
                          <div className="flex justify-center">
                            {user.isAdmin ? (
                              <span className="text-[9px] text-cyan-400 border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 rounded-full font-black shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                MASTER
                              </span>
                            ) : (
                              <span className="text-[9px] text-gray-500 border border-white/5 bg-white/5 px-3 py-1 rounded-full font-black">
                                USER
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-5 text-center w-[15%]">
                          <div className="flex justify-center gap-4 min-h-[32px] items-center">
                            {editableUserId === user._id ? (
                              <>
                                <FaCheck
                                  className="text-green-500 cursor-pointer hover:scale-125 transition"
                                  onClick={() => updateHandler(user._id)}
                                />
                                <FaTimes
                                  className="text-red-500 cursor-pointer hover:scale-125 transition"
                                  onClick={() => setEditableUserId(null)}
                                />
                              </>
                            ) : user.isAdmin ? (
                              <motion.div
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-cyan-400/40 cursor-not-allowed drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                              >
                                <FaUserShield size={18} />
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 rounded-lg bg-rose-600/10 text-rose-500/40 hover:text-rose-400 hover:bg-rose-500/20 transition-all duration-300"
                              >
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
          </div>
        )}
      </ShootingStarBackground>

      {/* 🛡️ Custom Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-950 border border-rose-500/20 rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <FaExclamationTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
                  Delete Request
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
                  Confirm Deletion of Record
                </p>

                <div className="w-full bg-white/[0.03] rounded-3xl p-6 mb-8 border border-white/5 text-left space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                      User Details
                    </span>
                    <span className="text-[10px] font-mono text-gray-200/50">
                      ID: {userToDelete?._id}
                    </span>
                    <span className="text-sm font-bold text-gray-200">
                      Username: {userToDelete?.username}
                    </span>
                    <span className="text-sm font-bold text-gray-200">
                      Email: {userToDelete?.email}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition"
                  >
                    Abort
                  </button>
                  <button
                    onClick={confirmDeleteHandler}
                    className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/40 transition"
                  >
                    Execute
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;