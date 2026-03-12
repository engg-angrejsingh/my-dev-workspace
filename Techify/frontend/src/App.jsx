import React from 'react'
import {Outlet} from 'react-router-dom';
import './App.css'
import Navigation from './pages/Auth/Navigation';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from "react-redux";
import Loader from "./components/Loader";

function App() {

  const isLoading = useSelector((state) => 
    Object.values(state.api.queries).some(query => query.status === 'pending') ||
    Object.values(state.api.mutations).some(mutation => mutation.status === 'pending')
  );

  return (
    <>
      <ToastContainer/>
      <Navigation/>
      {isLoading && <Loader />}
      <main>
        <Outlet/>
      </main>
    </>
  )
}

export default App