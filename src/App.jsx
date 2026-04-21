import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}