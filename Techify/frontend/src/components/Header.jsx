import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import ProductCarousel from "../pages/Products/productCarousel";
import SmallProduct from "../pages/Products/SmallProduct";

function Header() {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return null;
  if (error) return <h1 className="text-red-500">Error loading products</h1>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start w-full">
      {/* Featured Carousel (Left) */}
      <div className="w-full lg:w-[60%]">
        <ProductCarousel />
      </div>

      {/* Small Grid (Right) */}
      <div className="w-full lg:w-[40%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;