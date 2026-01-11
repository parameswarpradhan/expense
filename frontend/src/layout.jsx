import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import FullScreenLoader from "./components/FullScreenLoader";

export default function Layout() {
  const { user, logout, loading } = useContext(AuthContext);

  const handleLogout = () => {
    console.log("clicked");
    if (logout) {
      logout();
    }
  };

  return (
    // 1. Base Container: Light theme, full height, no fixed overflow clipping
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-cyan-200 selection:text-cyan-900">
      
      {loading && <FullScreenLoader />}

      {/* Background Texture (Consistent with Landing Page) */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <svg className="h-full w-full">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* 2. Header: Sticky, White, with subtle border - Professional Look */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-xl">
                    S
                </div>
                <div className="text-xl font-extrabold tracking-tight text-slate-900">
                Splitter
                </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex gap-1">
              <NavLink
                to="/"
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive
                     ? "bg-slate-100 text-slate-900"
                     : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive
                     ? "bg-slate-100 text-slate-900"
                     : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
                {loading ? null : user ? (
                  <button
                    onClick={handleLogout}
                    className="
                        text-sm font-bold text-red-600 
                        hover:bg-red-50 px-4 py-2 rounded-lg transition duration-200
                    "
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition duration-150 px-4 py-2"
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="
                        bg-slate-900 text-white text-sm
                        font-bold py-2 px-5 rounded-lg shadow-md shadow-slate-900/10
                        hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200
                      "
                    >
                      Register
                    </NavLink>
                  </>
                )}
            </div>

          </nav>
        </header>

        {/* 3. Main Content: UNBOXED */}
        {/* Removed fixed height and overflow. This allows the page to grow naturally. */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
            <Outlet />
        </main>

        {/* Optional Footer filler to make it look grounded */}
        <footer className="w-full border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
            © 2026 Splitter Finance. All rights reserved.
        </footer>

      </div>
    </div>
  );
}