import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", color: "white", display: "grid", placeItems: "center" }}>
        Carregando Lyra...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Register />}
      />

      <Route
        path="/welcome"
        element={isAuthenticated ? <Welcome /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} replace />}
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} replace />}
      />
    </Routes>
  );
}