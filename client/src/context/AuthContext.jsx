import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../api/apiService";

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the whole app and manages:
 *  - user state (decoded from localStorage on mount)
 *  - login / register / logout actions
 *  - authentication status flag
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // initial hydration from localStorage

  // Hydrate user state from localStorage on first render
  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
