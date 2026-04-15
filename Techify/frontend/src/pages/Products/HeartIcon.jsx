import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";
import { useEffect } from "react";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    // Prevent the click from bubbling up to the <Link> wrapping your product card
    e.preventDefault(); 
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div 
      className="absolute top-1 right-2 p-4 cursor-pointer rounded-full transition-transform hover:scale-110 z-20"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart size={20} className="text-pink-500" />
      ) : (
        <FaRegHeart size={20} className="text-gray-400" />
      )}
    </div>
  );
};

export default HeartIcon;