import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect
} from "react-router-dom";
import Layout from "../layout.jsx";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import SplitExpense from "../pages/SplitExpense.jsx";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react"
import { AuthContext } from "../Context/AuthContext.jsx";

const ProtectedRouteElement = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "about", element: <About /> },
            { path: "contact", element: <Contact /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            {
                
                element: <ProtectedRouteElement />,
                children: [
                    
                    { path: "createEntry", element: <SplitExpense /> }, 
                ]
            },
            
            { path: "*", element: <Navigate to="/" replace /> } 
        ]
    }
]);
export default router;