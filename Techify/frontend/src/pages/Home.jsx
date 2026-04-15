import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../redux/api/productApiSlice';
import Product from './Products/Product';

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  // Safe extraction: handles if 'data' is the array itself, or if 'data.products' is the array.
  const products = Array.isArray(data) 
    ? data 
    : Array.isArray(data?.products) 
      ? data.products 
      : [];

  return (
    <div className="w-full min-h-screen  bg-gradient-to-b from-[#030712] via-slate-950 to-black text-white">
      {/* On Desktop (lg), we add padding-left (pl-20) so the fixed sidebar 
         doesn't hide our products. 
      */}
      <div className="lg:pl-[80px] w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-10 py-8">
          
          {/* Top Section */}
          {!keyword ? <Header /> : null}

          {isLoading ? (
            <div className="flex justify-center mt-20"><Loader /></div>
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <div className="mt-20">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Special Products
                </h1>
                <Link to='/shop'>
                <button className="bg-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-700 transition-all">
                  Shop
                </button>
                </Link>
              </div>

              {/* Main Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;