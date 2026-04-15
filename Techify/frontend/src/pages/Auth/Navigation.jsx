import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineDashboard,
  AiOutlineDatabase,
  AiOutlinePlusCircle,
  AiOutlineAppstore,
  AiOutlineOrderedList,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

import "./Navigation.css";
import FavoritesCount from "../Products/FavoritesCount";

function Navigation() {
  const { userInfo } = useSelector((state) => state.auth);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showSidebar]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setShowSidebar(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 📱 MOBILE TOGGLE BUTTON */}
      <button
        className="fixed top-5 right-5 z-[1001] p-2 bg-[#030712] text-white rounded-lg lg:hidden border border-slate-700"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? (
          <AiOutlineClose size={20} />
        ) : (
          <AiOutlineMenu size={20} />
        )}
      </button>

      {/* 🌑 MOBILE OVERLAY */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/60 z-[998] lg:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* 🧭 SIDEBAR MAIN CONTAINER */}
      <div
        id="navigation-container"
        className={`
          fixed left-0 top-0 h-screen z-[999] transition-all duration-300 ease-in-out text-white 
          bg-gradient-to-b from-[#030712] via-slate-950 to-black
          border-r border-slate-800 flex flex-col group
          ${showSidebar ? "translate-x-0 w-[250px]" : "-translate-x-full lg:translate-x-0 lg:w-[75px] lg:hover:w-[220px]"}
        `}
      >
        {/* INNER WRAPPER */}
        <div className="flex flex-col h-full p-4">
          {/* 🔥 LOGO */}
          <div className="text-center mt-2 lg:mt-4 mb-10 flex-shrink-0 flex items-center justify-center">
            <h1
              className="techify-text text-xl font-bold tracking-tighter"
              id="techify-text"
            >
              TECHIFY
            </h1>
          </div>

          {/* 🔗 MAIN NAVIGATION */}
          <nav className="flex flex-col space-y-2 lg:space-y-4 flex-grow">
            {[
              {
                to: "/",
                icon: <AiOutlineHome size={26} />,
                label: "Home",
                hover: "hover:text-pink-600",
              },
              {
                to: "/shop",
                icon: <AiOutlineShopping size={26} />,
                label: "Shop",
                hover: "hover:text-purple-500",
              },
              {
                to: "/cart",
                icon: <AiOutlineShoppingCart size={26} />,
                label: "Cart",
                hover: "hover:text-green-500",
              },
              {
                to: "/favourite",
                icon: (
                  <div className="relative flex items-center justify-center">
                    <FaHeart size={22} />
                    <FavoritesCount />
                  </div>
                ),
                label: "Favourites",
                hover: "hover:text-red-500",
              },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setShowSidebar(false)}
                className={`flex items-center gap-4 text-gray-400 ${link.hover} hover:translate-x-2 transition-all duration-300 py-2`}
              >
                <div className="min-w-[40px] flex justify-center">
                  {link.icon}
                </div>
                <span
                  className={`whitespace-nowrap transition-all duration-300 
                  ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* 🛠️ ADMIN LINKS */}
            {userInfo && userInfo.isAdmin && (
              <div className="flex flex-col space-y-2 mt-4">
                <div
                  className={`border-t border-slate-800 mb-2 transition-opacity duration-300 ${showSidebar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                ></div>

                <p
                  className={`text-[10px] uppercase tracking-widest w-full text-center  text-slate-600 font-bold mb-1.5 ml-2 transition-opacity duration-300 ${showSidebar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  Admin
                </p>

                {[
                  {
                    to: "/admin/dashboard",
                    icon: <AiOutlineDashboard size={22} />,
                    label: "Dashboard",
                  },
                  {
                    to: "/admin/allproducts",
                    icon: <AiOutlineDatabase size={22} />, // Updated Icon
                    label: "All Products",
                  },
                  {
                    to: "/admin/productlist",
                    icon: <AiOutlinePlusCircle size={22} />, // Updated Icon
                    label: "Add Product",
                  },
                  {
                    to: "/admin/categorylist",
                    icon: <AiOutlineAppstore size={22} />,
                    label: "Category",
                  },
                  {
                    to: "/admin/orderlist",
                    icon: <AiOutlineOrderedList size={22} />,
                    label: "Orders",
                  },
                  {
                    to: "/admin/userlist",
                    icon: <AiOutlineUsergroupAdd size={22} />,
                    label: "Users",
                  },
                ].map((adminLink) => (
                  <Link
                    key={adminLink.label}
                    to={adminLink.to}
                    onClick={() => setShowSidebar(false)}
                    className="flex items-center gap-4 text-gray-400 hover:text-blue-400 hover:translate-x-2 transition-all duration-300 py-2"
                  >
                    <div className="min-w-[40px] flex justify-center">
                      {adminLink.icon}
                    </div>
                    <span
                      className={`whitespace-nowrap transition-all duration-300 
                      ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                    >
                      {adminLink.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* 👤 AUTHENTICATION SECTION */}
          <div className="mt-auto flex flex-col flex-shrink-0 pt-6 pb-4">
            <div
              className={`border-t border-slate-800 mb-4 transition-opacity duration-300 ${showSidebar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            ></div>

            {userInfo ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-4 text-gray-400 hover:text-blue-600 hover:translate-x-2 transition-all duration-300 py-2"
                >
                  <div className="min-w-[40px] flex justify-center items-center">
                    {userInfo.image ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-600 shadow-lg">
                        <img
                          src={userInfo.image}
                          alt="user"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <FaRegUserCircle
                        size={24}
                        className="transition-transform duration-300"
                      />
                    )}
                  </div>

                  <span
                    className={`truncate transition-all duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                  >
                    {userInfo.username}
                  </span>
                </Link>

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-4 text-gray-400 hover:text-red-500 hover:translate-x-2 transition-all duration-300 py-2 w-full text-left"
                >
                  <div className="min-w-[40px] flex justify-center">
                    <AiOutlineClose size={24} />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                  >
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-4 text-gray-400 hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 py-2"
                >
                  <div className="min-w-[40px] flex justify-center">
                    <AiOutlineLogin size={26} />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                  >
                    Login
                  </span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-4 text-gray-400 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 py-2"
                >
                  <div className="min-w-[40px] flex justify-center">
                    <AiOutlineUserAdd size={26} />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"}`}
                  >
                    Register
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
