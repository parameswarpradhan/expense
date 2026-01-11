import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // token is SOURCE OF TRUTH
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // 🔑 Load logged-in user using v2 API
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/me"); // /api/v2/me
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Auth init failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
