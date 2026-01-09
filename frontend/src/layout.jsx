import React, { useContext } from "react"; 
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext"; 

export default function Layout() {
  const { user, logout } = useContext(AuthContext); 


  const handleLogout = () => {
    console.log("clicked");
    if (logout) {
      logout();
    }
  };

  return (
    <div className="h-screen m-0 p-0 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat w-full">
      <div className="h-full w-full bg-black/10"> 
        
        {/* Header/Navigation */}
        <header className="px-10 pt-4 pb-2">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
                        <div className="text-3xl font-extrabold tracking-widest text-white">
              Splitter
            </div>
            
            <div className="flex gap-8 font-medium">
              <NavLink 
                to="/" 
                className={({isActive})=>`
                  text-lg font-semibold transition duration-200
                  ${isActive 
                    ? "text-cyan-400 border-b-2 border-cyan-400" 
                    : "text-gray-300 hover:text-cyan-400"
                  }`
                }
              >
                Home
              </NavLink> 
              <NavLink 
                to="/about" 
                className={({isActive})=>`
                  text-lg font-semibold transition duration-200
                  ${isActive 
                    ? "text-cyan-400 border-b-2 border-cyan-400" 
                    : "text-gray-300 hover:text-cyan-400"
                  }`
                }
              >
                About
              </NavLink> 
              <NavLink 
                to="/contact" 
                className={({isActive})=>`
                  text-lg font-semibold transition duration-200
                  ${isActive 
                    ? "text-cyan-400 border-b-2 border-cyan-400" 
                    : "text-gray-300 hover:text-cyan-400"
                  }`
                }
              >
                Contact
              </NavLink> 
            </div>
            
            <div className="flex gap-4">
              {user ? (
                <button 
                  onClick={handleLogout} 
                  className="
                    bg-red-600 text-white 
                    font-bold py-2 px-4 rounded-full shadow-lg shadow-red-600/50
                    hover:bg-red-500 transition duration-200
                  "
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className="text-white hover:text-cyan-400 transition duration-150 py-2 px-3"
                  >
                    Login
                  </NavLink>
                  {/* Primary Call-to-Action: Register */}
                  <NavLink 
                    to="/register" 
                    className="
                      bg-cyan-500 text-gray-900 
                      font-bold py-2 px-4 rounded-full shadow-lg
                      hover:bg-cyan-400 transition duration-200
                    "
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </nav>
          {/* Subtle separator line */}
          <hr className="w-full border-t border-gray-700 mt-3 max-w-7xl mx-auto"/>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto p-10 pt-8 h-full">
            <div className="
              bg-white/5 backdrop-blur-md rounded-2xl 
              shadow-2xl shadow-black/50 border border-white/10
              h-[calc(100vh-120px)] overflow-y-auto 
              p-8 text-gray-100
            ">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}