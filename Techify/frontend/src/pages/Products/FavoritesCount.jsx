import { useSelector } from "react-redux";

const FavoritesCount = () => {
  // SAFETY FIX: Added "|| []" so it always defaults to an array, preventing crashes
  const favorites = useSelector((state) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <span className="absolute -top-2 -right-2">
      {favoriteCount > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-pink-500 rounded-full shadow-md">
          {favoriteCount}
        </span>
      )}
    </span>
  );
};

export default FavoritesCount;