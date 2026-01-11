import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ ADD token support for v2 APIs
  const [token, setToken] = useState(localStorage.getItem("token") || null);


  const url = "http://localhost:8080/";

  const triggerRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${url}logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUser(null);
        setUserData(null);
        setTransactions([]);

        // ✅ clear token
        localStorage.removeItem("token");
        setToken(null);

        console.log("User logged out.");
      } else {
        console.error("Logout failed on server side.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // ✅ Still keep cookie-based login check
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetch(`${url}me`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?._id) {
      setUserData(null);
      setTransactions([]);
      return;
    }

    const fetchUserDetailsAndTransactions = async () => {
      try {
        const userRes = await fetch(`${url}api/user/${user._id}`);
        const userData = await userRes.json();
        setUserData(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      try {
        const txRes = await fetch(`${url}api/transactions/${user._id}`);
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchUserDetailsAndTransactions();
  }, [user, refreshKey, url]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userData,
        setUserData,
        transactions,
        setTransactions,
        loading,
        url,
        logout,
        triggerRefresh,

        // ✅ expose token
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
