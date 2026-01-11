import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";

import Layout from "../layout.jsx";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
// import FullScreenLoader from "../components/FullScreenLoader";


import SplitExpense from "../pages/SplitExpense.jsx";

import JoinGroup from "../pages/JoinGroup.jsx";
import GroupDashboard from "../pages/GroupDashboard.jsx";
import MyGroups from "../pages/MyGroups.jsx";

// ✅ IMPORTANT: import correct register form page
import RegisterForm from "../pages/RegisterForm.jsx"; // <-- create this file OR rename old Register page to this

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";

import FullScreenLoader from "../components/FullScreenLoader";

const ProtectedRouteElement = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <FullScreenLoader text="Checking session..." />;

  if (!user) return <Navigate to="/login" replace />;

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

      // ✅ this is real register page (PUBLIC)
      { path: "register", element: <RegisterForm /> },

      {
        element: <ProtectedRouteElement />,
        children: [
          // ✅ group dashboard should be protected
          { path: "dashboard", element: <MyGroups /> },
          { path: "createEntry", element: <SplitExpense /> },
          { path: "join/:token", element: <JoinGroup /> },
          { path: "groups/:groupId", element: <GroupDashboard /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
