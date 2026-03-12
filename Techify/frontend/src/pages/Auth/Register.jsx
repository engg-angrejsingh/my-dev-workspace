import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { showError, showSuccess } from "../../utils/toast";

// Icons
import { FaRegUser, FaCheckCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nameInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    nameInputRef.current?.focus();
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      
      setIsSuccess(true);
      showSuccess("Account created successfully 🎉");
      
      setTimeout(() => {
        navigate(redirect);
      }, 1500);
    } catch (err) {
      showError(err?.data?.message || err.message);
    }
  };

  return (
    <div className="animate-up delay-100 w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl transition-all duration-500">
      <h2 className="text-xl font-semibold text-center mb-8">Register</h2>

      <form onSubmit={submitHandler} className="space-y-5">
        
        {/* Full Name */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-500 transition-all">
            <FaRegUser className="text-gray-400 group-focus-within:text-pink-500" />
            <input
              ref={nameInputRef}
              type="text"
              required
              disabled={isLoading}
              placeholder="Angrej Singh"
              className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-700 disabled:cursor-not-allowed"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>

        {/* Email Address */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-500 transition-all">
            <MdEmail className="text-gray-400 group-focus-within:text-pink-500" />
            <input
              type="email"
              required
              disabled={isLoading}
              placeholder="example@gmail.com"
              className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-700 disabled:cursor-not-allowed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Secret Key</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-purple-500 transition-all">
            <RiLockPasswordFill className="text-gray-400 group-focus-within:text-purple-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-700 disabled:cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)} 
              className="text-gray-500 disabled:opacity-30"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className={`group space-y-2 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Verify Key</label>
          <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-1 focus-within:border-purple-500 transition-all">
            <RiLockPasswordFill className="text-gray-400 group-focus-within:text-purple-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full p-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-700 disabled:cursor-not-allowed"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button 
              type="button" 
              disabled={isLoading}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="text-gray-500 disabled:opacity-30"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="animate-up delay-200 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
              isSuccess ? "bg-green-600 shadow-green-500/20" : "bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110"
            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            {isLoading ? (
              "Initializing..."
            ) : isSuccess ? (
              <>
                <FaCheckCircle className="animate-bounce" /> Account Created
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="animate-up delay-200 text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to={isLoading ? "#" : (redirect ? `/login?redirect=${redirect}` : "/login")}
              className={`text-pink-400 font-bold hover:text-pink-300 transition-colors ${isLoading ? "pointer-events-none opacity-30" : ""}`}
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;