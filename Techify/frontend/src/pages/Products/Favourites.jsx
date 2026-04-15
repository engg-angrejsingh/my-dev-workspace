import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectFavoriteProduct } from '../../redux/features/favorites/favoriteSlice';
import Product from "./Product.jsx";

const Favorites = () => {
  // Safety check: ensure it defaults to an empty array
  const favorites = useSelector(selectFavoriteProduct) || [];

  return (
    // Outer wrapper perfectly matches your Home.jsx layout
    <div className="w-full min-h-screen  bg-gradient-to-b from-[#030712] via-slate-950 to-black text-white">
      {/* lg:pl-[80px] prevents the sidebar from hiding your content */}
      <div className="lg:pl-[80px] w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-10 py-10">
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
            Favorite Products
            <span className="text-pink-500 ml-3 text-2xl">({favorites.length})</span>
          </h1>

          {/* Conditional Empty */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 bg-[#161b22] py-20 rounded-[2rem] border border-white/5">
              <h2 className="text-xl md:text-2xl text-white/40 font-medium mb-8">
                You haven't saved any favorites yet.
              </h2>
              <Link to="/shop">
                <button className="bg-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            /* Product Grid: Exactly matches Home.jsx so your cards are perfectly sized */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {favorites.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Favorites;