import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";

export default function App() {
  const token = localStorage.getItem("lyra_token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/welcome"
        element={token ? <Welcome /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/"
        element={<Navigate to={token ? "/welcome" : "/login"} replace />}
      />

      <Route
        path="*"
        element={<Navigate to={token ? "/welcome" : "/login"} replace />}
      />
    </Routes>
  );
}