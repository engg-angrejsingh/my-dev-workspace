import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showError, showSuccess } from "../../utils/toast";
import { setCredentials } from "../../redux/features/auth/authSlice"; 
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { motion } from "framer-motion";

// Components
import MotionBackground from "../../components/Animation/MotionBackground"; 

// Icons
import { FaRegUser, FaCheckCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// 🚀 FIXED: Moved InputField OUTSIDE to prevent cursor remove on typing
// UI matches your screenshot exactly
const InputField = ({ label, icon: Icon, type, value, onChange, placeholder, isPassword, showPwd, togglePwd, focusColor }) => (
  <div className="group space-y-2 w-full flex flex-col">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
      {label}
    </label>
    <div className={`flex items-center bg-[#151924] border border-white/5 rounded-2xl px-4 py-1.5 
      focus-within:border-${focusColor}-500 focus-within:shadow-[0_0_15px_rgba(var(--${focusColor}-rgb),0.15)] transition-all duration-300`}>
      <Icon className={`text-slate-500 group-focus-within:text-${focusColor}-400 transition-colors duration-300 text-lg`} />
      <input 
        type={isPassword ? (showPwd ? "text" : "password") : type} 
        placeholder={placeholder}
        className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-slate-700 font-medium" 
        value={value} 
        onChange={onChange} 
      />
      {isPassword && (
        <button type="button" onClick={togglePwd} className="text-slate-500 hover:text-white px-2 transition-colors">
          {showPwd ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      )}
    </div>
  </div>
);

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
      }, 2000);
    } catch (err) {
      showError(err?.data?.message || err.error);
    }
  };

  const isUnchanged = 
    username === userInfo?.username && 
    email === userInfo?.email && 
    password === "" && 
    confirmPassword === "";

  const isButtonDisabled = loadingUpdateProfile || isUnchanged;

  return (
    // FULL SCREEN WRAPPER FOR CENTERING
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:pl-[85px] overflow-hidden">
      
      {/* THE MOTION BACKGROUND */}
      <MotionBackground />

      {/* THE PROFILE CARD - WIDTH INCREASED & UI TWEAKED */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-[#02020a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden"
      >
        {/* Subtle Top Glow for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm" />

        <div className="text-center mb-10">
          <h2 className="techify-text text-3xl font-black text-gray-500 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Profile Settings
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-widest">
            Manage your personal secure information
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-8">
          
          {/* RESPONSIVE GRID: 1 column on mobile, 2 columns on medium+ screens */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6">
            <InputField 
              label="Username" 
              icon={FaRegUser} 
              type="text" 
              value={username} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="John Doe"
              focusColor="pink"
            />

            <InputField 
              label="Email Address" 
              icon={MdEmail} 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@gmail.com"
              focusColor="pink"
            />

            <InputField 
              label="Secret Key (New Password)" 
              icon={RiLockPasswordFill} 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              isPassword={true}
              showPwd={showPassword}
              togglePwd={() => setShowPassword(!showPassword)}
              focusColor="purple"
            />

            <InputField 
              label="Verify Key (Confirm Password)" 
              icon={RiLockPasswordFill} 
              type="password" 
              placeholder="••••••••"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              isPassword={true}
              showPwd={showConfirmPassword}
              togglePwd={() => setShowConfirmPassword(!showConfirmPassword)}
              focusColor="purple"
            />
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-4 rounded-xl font-bold tracking-wide text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                isButtonDisabled 
                  ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5" 
                  : isSuccess 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 shadow-pink-500/20"
              }`}
            >
              {loadingUpdateProfile ? (
                <span className="animate-pulse">Updating System...</span>
              ) : isSuccess ? (
                <><FaCheckCircle size={16} className="animate-bounce" /> Profile Secured</>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;