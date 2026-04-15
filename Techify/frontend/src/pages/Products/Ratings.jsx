import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Defaulted the color to yellow/amber so it works out of the box
const Ratings = ({ value, text, color}) => {
  const fullStars = Math.floor(value);
  // FIX 1: Corrected 'fullStar' typo to 'fullStars', and changed > to >=
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className='flex items-center gap-1'>
      
      {/* FIX 2: Swapped FaRegStar for FaStar (solid) for the full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`text-${color} ml-1`} />
      ))}

      {/* Half Star */}
      {halfStars === 1 && <FaStarHalfAlt  className={`text-${color} ml-1`} />}

      {/* FIX 3: Actually map and render the empty stars! */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`}  className={`text-${color} ml-1`} />
      ))}

      {/* Renders the review text (e.g., "12 Reviews") if it was passed in */}
      {text && <span className="ml-2 text-sm text-gray-400">{text}</span>}
      
    </div>
  );
};

Ratings.defaultProps = {
  color: `yellow-500`
}

export default Ratings;