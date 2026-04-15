// 🎯 MAIN COMPONENT: Shows product reviews and related items in tabs
// Handles creating, editing, and deleting reviews with nice UI
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery, useDeleteReviewMutation, useUpdateReviewMutation } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import {
  FaComments, FaPenNib, FaLayerGroup, FaTrash, FaEdit, FaTimes, FaMousePointer,
  FaAngry, FaFrown, FaMeh, FaSmile, FaGrinBeam
} from "react-icons/fa";
import { showSuccess, showError } from "../../utils/toast";

const ProductTabs = ({
  userInfo,
  product,
  refetch,
  createReview,
  updateReview,
  deleteReview,
  loadingReview,
}) => {
  // 📦 GET OTHER PRODUCTS: Fetch similar products for recommendations
  const { data: allProducts, isLoading } = useGetTopProductsQuery();
  
  // 🎛️ FORM STATE: Track what user is typing and selecting
  const [localRating, setLocalRating] = useState(0);
  const [localComment, setLocalComment] = useState("");
  const [hover, setHover] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // 🏷️ RATING LABELS: Fun words and emojis for each star rating
  const ratingData = {
    1: { label: "Inferior", icon: <FaAngry /> },
    2: { label: "Decent", icon: <FaFrown /> },
    3: { label: "Great", icon: <FaMeh /> },
    4: { label: "Excellent", icon: <FaSmile /> },
    5: { label: "Exceptional", icon: <FaGrinBeam /> },
  };

  // 🧹 CLEANUP: Reset text and cursor when switching products
  useEffect(() => {
    setLocalRating(0);
    setLocalComment("");
    setIsEditing(false);
    setHover(0);
  }, [product?._id]);

  // 🔍 FIND REVIEWS: Separate user's review from others
  const userReview = product?.reviews?.find(
    (r) => r.user?.toString() === userInfo?._id?.toString() || r.user === userInfo?._id
  );

  const otherReviews = product?.reviews
    ?.filter((r) => r._id !== userReview?._id)
    ?.sort((a, b) => b.rating - a.rating) || [];

  // 📝 SAVE REVIEW: Handle creating or updating reviews
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localRating === 0) return showError("Please select a mood rating!");
    
    try {
      if (isEditing) {
        await updateReview({ 
          productId: product._id, 
          reviewId: userReview._id, 
          rating: localRating, 
          comment: localComment 
        }).unwrap();
        showSuccess("Review updated!");
        setIsEditing(false);
      } else {
        await createReview({ 
          productId: product._id, 
          rating: localRating, 
          comment: localComment 
        }).unwrap();
        showSuccess("Review published!");
      }
      refetch();
    } catch (err) { showError(err?.data?.message || err.error); }
  };

  // 🗑️ DELETE REVIEW: Remove user's review with confirmation
  const handleDelete = async () => {
    if (window.confirm("Delete your review permanently?")) {
      try {
        await deleteReview({ productId: product._id, reviewId: userReview._id }).unwrap();
        toast.success("Review removed");
        refetch();
      } catch (err) { toast.error(err?.data?.message || err.error); }
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader /></div>;

  return (
    <div className="flex flex-col gap-12 w-full animate-fadeIn pb-20">
      
       {/* 📝 SECTION 1: NEW REVIEW FORM */}
      {!userReview && (
        <section className="w-full bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-600/5 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-3 mb-6">
            <FaPenNib className="text-pink-500 text-lg" />
            <h2 className="text-lg font-black uppercase tracking-tight text-white/90">Write your Review</h2>
          </div>

          {userInfo ? (
            <form onSubmit={handleSubmit} className="w-full space-y-6 relative z-10">
              <div className="flex items-center gap-10">
                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Select Mood</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button 
                        key={val} type="button" 
                        onClick={() => setLocalRating(val)} 
                        onMouseEnter={() => setHover(val)} 
                        onMouseLeave={() => setHover(0)} 
                        className="transition-transform active:scale-90"
                      >
                        <div className={`text-4xl transition-all duration-300 ${
                          (hover || localRating) === val 
                          ? "text-amber-400 opacity-100 scale-125 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" 
                          : "text-white/30 hover:text-white/50" 
                        }`}>
                          {ratingData[val].icon}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {(hover || localRating) > 0 && (
                  <div className="mt-6 animate-fadeIn">
                    <span className="text-pink-500 font-black uppercase text-[10px] tracking-[0.25em] bg-pink-500/5 px-4 py-2 border border-pink-500/10 rounded-full animate-pulse">
                      {ratingData[hover || localRating].label}
                    </span>
                  </div>
                )}
              </div>

              <textarea 
                rows="3" 
                required 
                value={localComment} 
                onChange={(e) => setLocalComment(e.target.value)} 
                placeholder="Write your review..." 
                className="w-full p-6 bg-[#0d1117] border border-white/10 rounded-[1.5rem] text-white text-sm outline-none focus:border-pink-500/50 custom-scrollbar-thin transition-all resize-none shadow-inner" 
              />

              <button type="submit" disabled={loadingReview} className="bg-pink-600 hover:bg-pink-700 text-white font-black py-4 px-12 rounded-xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all">
                Publish Review
              </button>
            </form>
          ) : (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
              <Link to="/login" className="text-pink-500 font-bold hover:underline text-sm uppercase tracking-widest">Sign In to Review</Link>
            </div>
          )}
        </section>
      )}


      {/* 💬 SECTION 2: REVIEWS LIST */}
      <section className="w-full relative">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <FaComments className="text-pink-500 text-2xl" />
            <h2 className="text-2xl font-black tracking-tight">Customer Feedback</h2>
          </div>
          {userReview && !isEditing && (
            <span className="text-[9px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2">
              <FaMousePointer size={9} className="text-pink-500" /> Double click to edit
            </span>
          )}
        </div>

        <div className="relative group/review-container">
          <div className="space-y-4 custom-scrollbar-thin max-h-[500px] overflow-y-auto pr-3 pb-8">
            
            {/* 📌 USER'S OWN REVIEW: Special highlight for logged-in user's review */}
            {userReview && (
              <div 
                onDoubleClick={() => setIsEditing(true)}
                className="bg-pink-600/5 border border-pink-500/20 p-6 rounded-[2rem] relative group shadow-xl transition-all"
              >
                <div className="absolute top-5 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setIsEditing(!isEditing); setLocalRating(userReview.rating); setLocalComment(userReview.comment); }} className="p-2.5 bg-white/5 hover:bg-pink-600 rounded-xl transition-colors">
                    {isEditing ? <FaTimes size={12}/> : <FaEdit size={12}/>}
                  </button>
                  <button onClick={handleDelete} className="p-2.5 bg-white/5 hover:bg-red-600 rounded-xl transition-colors">
                    <FaTrash size={12}/>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-600/20">{userReview.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2"><strong className="text-white text-base">Your Review</strong><span className="text-[8px] bg-pink-600 text-white px-2 py-0.5 rounded font-black uppercase">You</span></div>
                    <Ratings value={isEditing ? localRating : userReview.rating} />
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button key={val} type="button" onClick={() => setLocalRating(val)} className={`text-2xl transition-all ${localRating === val ? "text-amber-400 opacity-100 scale-110" : "text-white/40 hover:text-white/60"}`}>
                            {ratingData[val].icon}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{ratingData[localRating]?.label}</span>
                    </div>
                    <textarea 
                      value={localComment} 
                      onChange={(e) => setLocalComment(e.target.value)} 
                      className="w-full p-5 bg-[#0d1117] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-pink-500 custom-scrollbar-thin transition-all" 
                      rows="3" 
                      placeholder="Write your review..."
                      autoFocus 
                    />
                    <div className="flex gap-3">
                       <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Save Changes</button>
                       <button type="button" onClick={() => setIsEditing(false)} className="bg-white/5 text-white/50 px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-white/10">Cancel</button>
                    </div>
                  </form>
                ) : <p className="text-white/80 leading-relaxed italic border-l-2 border-pink-500 pl-4 text-sm">"{userReview.comment}"</p>}
              </div>
            )}

            {/* 👥 OTHER CUSTOMERS' REVIEWS: Show all other reviews sorted by rating */}
            {otherReviews.length === 0 && !userReview ? (
               <div className="py-16 text-center text-white/10 italic border border-dashed border-white/5 rounded-[2rem]">No feedback shared yet.</div>
            ) : otherReviews.map((r) => (
              <div key={r._id} className="bg-[#161b22]/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 font-bold">{r.name.charAt(0)}</div>
                    <div><strong className="text-white text-sm block">{r.name}</strong><Ratings value={r.rating} /></div>
                  </div>
                  <span className="text-[9px] text-white/10 font-bold uppercase">{r.createdAt.substring(0, 10)}</span>
                </div>
                <p className="text-white/40 text-sm italic border-l border-white/10 pl-4">"{r.comment}"</p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none rounded-b-[2rem] opacity-60"></div>
        </div>
      </section>


      {/* 🛍️ SECTION 3: RELATED PRODUCTS */}
      <section className="w-full pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 mb-10">
          <FaLayerGroup className="text-pink-500 text-xl" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white/80">Related Products</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts?.filter(p => p._id !== product?._id).slice(0, 4).map((p) => (
            <div key={p._id} className="bg-[#161b22]/30 p-5 rounded-[2.5rem] border border-white/5 hover:border-pink-500/20 transition-all shadow-xl hover:-translate-y-2 duration-300">
              <SmallProduct product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 🎨 CUSTOM STYLES: Scrollbar and animations */}
      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 2px !important; height: 2px !important; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: #db2777; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

    </div>
  );
};

export default ProductTabs;