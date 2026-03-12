import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { showError, showSuccess } from "../../utils/toast";
import { FaRegUser, FaCheckCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const emailRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 🔍 isLoading detects the 2-second server delay
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    emailRef.current?.focus();
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let finalEmail = email.includes("@") ? email : `${email}@gmail.com`;
    try {
      const res = await login({ email: finalEmail, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      setIsSuccess(true);
      showSuccess("Welcome back 🚀");
      setTimeout(() => navigate(redirect), 1500);
    } catch (error) {
      showError(error?.data?.message || error.message);
    }
  };

  return (
    <div className="animate-up w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl transition-all duration-500">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Sign In</h2>
      <form onSubmit={submitHandler} className="space-y-5">
        
        {/* 📧 Email Input */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-500 transition-all">
            <FaRegUser className="text-gray-400 group-focus-within:text-pink-500" />
            <input 
              ref={emailRef} 
              type="text" 
              required 
              disabled={isLoading} // 🔒 DISABLES INPUT DURING REQUEST
              placeholder="Email or Username" 
              className="w-full p-3 bg-transparent text-white outline-none text-sm disabled:cursor-not-allowed" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </div>

        {/* 🔑 Password Input */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Secret Key</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-purple-500 transition-all">
            <RiLockPasswordFill className="text-gray-400 group-focus-within:text-purple-500" />
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              disabled={isLoading} // 🔒 DISABLES INPUT DURING REQUEST
              placeholder="••••••••" 
              className="w-full p-3 bg-transparent text-white outline-none text-sm disabled:cursor-not-allowed" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              type="button" 
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)} 
              className="text-gray-500 disabled:opacity-30"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            isSuccess ? "bg-green-600" : "bg-gradient-to-r from-pink-600 to-purple-600 active:scale-95"
          } ${isLoading ? "opacity-70 cursor-wait" : "hover:brightness-110"}`}
        >
          {isLoading ? "Loading..." : isSuccess ? <><FaCheckCircle /> Authenticated</> : "Login"}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            New here? 
            <Link 
              to={isLoading ? "#" : (redirect ? `/register?redirect=${redirect}` : "/register")} 
              className={`text-pink-400 font-bold ml-1 hover:text-pink-300 ${isLoading ? "pointer-events-none opacity-30" : ""}`}
            >
              Join Techify
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;