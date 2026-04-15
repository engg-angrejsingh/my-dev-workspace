import React from "react";
import { FaPlus, FaLayerGroup } from "react-icons/fa";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Create Category",
}) => {
  return (
    /* Changed w-full to w-full lg:w-fit to allow it to be 
       auto-sized on desktop but full-width on mobile */
    <div className="w-full lg:w-fit lg:min-w-[450px]">
      <form 
        onSubmit={handleSubmit} 
        className="relative w-full flex items-center bg-white/5 rounded-2xl p-1 md:p-1.5 border border-white/5 transition-all duration-300 focus-within:border-white/20 focus-within:bg-white/[0.07] group"
      >
        {/* LEFT CORNER ICON - Hidden on very small screens to save space */}
        <div className="hidden xs:block pl-4 text-gray-600 group-focus-within:text-cyan-400 transition-colors">
          <FaLayerGroup size={14} />
        </div>

        {/* INPUT FIELD */}
        <input
          type="text"
          className="flex-1 bg-transparent py-3 px-3 md:px-4 outline-none text-white text-xs md:text-sm placeholder-gray-700 border-none focus:ring-0 font-medium tracking-wide uppercase min-w-0"
          placeholder="NEW CATEGORY..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* RIGHT SIDE BUTTON */}
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex items-center gap-2 bg-white text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-10 disabled:cursor-not-allowed shadow-lg whitespace-nowrap"
        >
          <span>{buttonText}</span>
          <FaPlus size={10} className="shrink-0" />
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;