import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("lyra_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("lyra_token");
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Token inválido ou expirado:", error);
        logout();
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, [token]);

  function saveSession(accessToken, userData) {
    localStorage.setItem("lyra_token", accessToken);
    localStorage.setItem("lyra_user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    saveSession(res.data.access_token, res.data.user);
    return res.data;
  }

  async function register(name, email, password) {
    const res = await api.post("/auth/register", { name, email, password });
    saveSession(res.data.access_token, res.data.user);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("lyra_token");
    localStorage.removeItem("lyra_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }

  return context;
}