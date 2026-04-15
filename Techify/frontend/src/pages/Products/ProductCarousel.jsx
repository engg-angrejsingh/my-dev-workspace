import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaStar, FaStore, FaRupeeSign } from "react-icons/fa";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";

const ProductCarousel = () => {
  const { data: products, isLoading } = useGetTopProductsQuery();
  const SlickSlider = Slider?.default || Slider;

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  if (isLoading) return null;

  return (
    <div className="w-full mb-4">
      <SlickSlider {...settings} className="w-full rounded-3xl overflow-hidden shadow-2xl">
        {products?.map((p) => (
          <div key={p._id} className="outline-none group">
            {/* 1. Top Section: Image, Name, and Price */}
            <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
              <img 
                src={p.image} 
                alt={p.name}
                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 will-change-transform" 
              />
              {/* Gradient Vignette for Text Clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-3 truncate">
                  {p.name}
                </h2>
                
                {/* UPGRADED: Flex layout perfectly aligns the Rupee sign with the text */}
                <span className="bg-pink-600 text-white w-fit flex items-center px-5 py-1.5 rounded-full font-black text-lg shadow-lg">
                  <FaRupeeSign className="text-[1.1rem] mr-[1px]" /> {p.price}
                </span>
                
                <p className="text-white/50 overflow-hidden text-xs mt-4 line-clamp-2 italic font-medium">
                  {p.description}
                </p>
              </div>
            </div>
            
            {/* 2. Bottom Section: Dashboard Stats */}
            <div className="bg-[#1a1f26] p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <FaStore className="text-white/80" /> Brand
                </span>
                <span className="text-sm font-bold truncate text-white">{p.brand}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <FaClock className="text-white/80" /> Added
                </span>
                <span className="text-sm font-bold text-white">{moment(p.createdAt).fromNow()}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <FaStar className="text-amber-400" /> Reviews
                </span>
                <span className="text-sm font-bold text-white">{p.rating} ({p.numReviews})</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <FaBox className="text-emerald-500" /> Stock
                </span>
                <span className="text-sm font-bold text-white">
                  {p.countInStock > 0 ? (
                    <span className="text-emerald-500">{p.countInStock}</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </SlickSlider>

      {/* Persistent Arrow Styling */}
      <style jsx global>{`
        .slick-prev:before, .slick-next:before {
          font-size: 30px !important;
          opacity: 0.2 !important;
          transition: all 0.3s;
        }
        .slick-prev:hover:before, .slick-next:hover:before {
          opacity: 1 !important;
          color: #db2777 !important;
        }
        .slick-prev { left: 20px; z-index: 20; }
        .slick-next { right: 20px; z-index: 20; }
      `}</style>
    </div>
  );
};

export default ProductCarousel;