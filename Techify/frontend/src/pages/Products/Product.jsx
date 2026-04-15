import React, { useState } from 'react'; // 1. Import useState
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight, FaHeart, FaRupeeSign } from 'react-icons/fa';
import HeartIcon from './HeartIcon';

const Product = ({ product }) => {
  
  // 2. Create state to track if it's favorited (defaults to false)
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // 3. Toggle the state between true and false every time it's clicked
    setIsFavorite(!isFavorite);
    
    // You will dispatch your addToFavorites Redux action here later
    console.log("Favorite toggled for:", product.name);
  };

  return (
    <div className="bg-[#161b22] rounded-[2rem] group block overflow-hidden border border-white/5 shadow-lg transition-all duration-500 group-hover:shadow-pink-500/10 group-hover:border-white/10">
        
        {/* Image Section */}
        <div className="relative h-[260px] w-full overflow-hidden bg-[#0d1117]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black/50 backdrop-blur-md text-white/70 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
              {product.brand}
            </span>
          </div>

            <HeartIcon product={product}/>
        </div>

    <Link to={`/product/${product._id}`} >
        {/* Content Section */}
        <div className="p-6 pt-4">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h2 className="text-white text-xl font-bold tracking-tight line-clamp-2 flex-1 transition-colors duration-300 group-hover:text-pink-400">
              {product.name}
            </h2>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-white font-bold text-2xl flex items-center gap-1">
                <FaRupeeSign className="text-lg" />{product.price}
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 shrink-0">
              <FaArrowRight className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </div>
          </div>
        </div>
    </Link>

      </div>
  );
};

export default Product;