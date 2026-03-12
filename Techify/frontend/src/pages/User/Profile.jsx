import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom"; // 👈 Trigger Shimmer
import { showError, showSuccess } from "../../utils/toast";
import { setCredentials } from "../../redux/features/auth/authSlice"; 
import { useProfileMutation } from "../../redux/api/usersApiSlice";

// Icons
import { FaRegUser, FaCheckCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Profile = () => {
  
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }


    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      setIsSuccess(true);
      showSuccess("Profile Updated ✨");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      showError(err?.data?.message || err.error);
    }
  };

  const isUnchanged = 
    username === userInfo.username && 
    email === userInfo.email && 
    password === "" && 
    confirmPassword === "";

  const isButtonDisabled = loadingUpdateProfile || isUnchanged;

  return (
    <div className="animate-up delay-100 w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl transition-all duration-500">
      <h2 className="text-xl font-semibold text-center mb-8">Update Profile</h2>

      <form onSubmit={submitHandler} className="space-y-5">
        <div className="group space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-500 transition-all">
            <FaRegUser className="text-slate-400 group-focus-within:text-pink-500" />
            <input type="text" className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-slate-700" value={username} onChange={(e) => setUserName(e.target.value)} />
          </div>
        </div>

        <div className="group space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-500 transition-all">
            <MdEmail className="text-slate-400 group-focus-within:text-pink-500" />
            <input type="email" className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-slate-700" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="group space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-purple-500 transition-all">
            <RiLockPasswordFill className="text-slate-400 group-focus-within:text-purple-500" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-slate-700" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white px-2">
              {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          </div>
        </div>

        <div className="group space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Verify Changes</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-purple-500 transition-all">
            <RiLockPasswordFill className="text-slate-400 group-focus-within:text-purple-500" />
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Verify Password" className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-slate-700" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-500 hover:text-white px-2">
              {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
              isButtonDisabled 
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" 
                : isSuccess 
                  ? "bg-green-600 shadow-green-500/20" 
                  : "bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110"
            }`}
          >
            {loadingUpdateProfile ? "Updating..." : isSuccess ? <><FaCheckCircle className="animate-bounce" /> Profile Saved</> : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;