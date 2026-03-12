import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

// Layouts
import AuthLayout from './components/Layout/AuthLayout.jsx'; // 👈 Import the new Layout

// Private Route
import PrivateRoutes from './components/PrivateRoutes.jsx';

// Auth Pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// User Pages
import Profile from './pages/User/Profile.jsx';
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';
import UserList from './pages/Admin/UserList.jsx';

//Admin Page

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      

      {/* 🌌 AUTH ROUTES (Shared Background) */}
      {/* Wrapping these in AuthLayout prevents the "refresh" flicker */}
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      {/* 🔐 PRIVATE ROUTES */}
      <Route path='' element={<PrivateRoutes />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
      </Route>

      <Route path='/admin' element={<AdminRoutes/>}>
          <Route path="userlist" element={<UserList/>}/>
      </Route>

    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);