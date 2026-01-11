import { StrictMode, useContext } from 'react'
// import './index.css'
import App from './App.jsx'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routing/router.jsx";

import { AuthProvider } from "./Context/AuthContext.jsx";
// import { useContext } from 'react';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
   <RouterProvider router={router} />
   </AuthProvider>
  </StrictMode>,
)
