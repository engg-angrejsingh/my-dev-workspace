import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

// Layouts
import AuthLayout from './components/Layout/AuthLayout.jsx'; 

// Private Route
import PrivateRoutes from './components/PrivateRoutes.jsx';

// Auth Pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// User Pages
import Profile from './pages/User/Profile.jsx';

//Admin Page
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';
import UserList from './pages/Admin/UserList.jsx';
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import AllProducts from './pages/Admin/AllProduct.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import Home from './pages/Home.jsx';
import Favorites from './pages/Products/Favourites.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>

      {/* 🌌 AUTH ROUTES (Shared Background) */}
      <Route element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Route>
      <Route index={true} element={<Home />} />
      <Route path='/favourite' element={<Favorites/>} />
      <Route path='/product/:id' element={<ProductDetails/>} />

      {/* 🔐 PRIVATE ROUTES */}
      <Route element={<PrivateRoutes />}>
        <Route path='profile' element={<Profile />} />
      </Route>

      <Route path='admin' element={<AdminRoutes />}>
        <Route path='userlist' element={<UserList />} />
        <Route path='categorylist' element={<CategoryList />} />
        <Route path='productlist' element={<ProductList />} />
        <Route path='allproducts' element={<AllProducts />} />
        <Route path='product/update/:_id' element={<ProductUpdate />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);