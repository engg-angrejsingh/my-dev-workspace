import { Link } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full h-full bg-[#1a1f26] rounded-2xl border border-white/5 overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="h-[180px] overflow-hidden">
          <img 
            src={product.image} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-white font-bold text-sm truncate">{product.name}</h2>
            <span className="bg-pink-600/10 text-white px-2 py-0.5 rounded text-xs font-black flex items-center gap-1">
              <FaRupeeSign className="text-[10px] text-white" />{product.price}
            </span>
          </div>
          <p className="text-gray-400 text-[10px] line-clamp-1 italic">{product.description}</p>
          
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;