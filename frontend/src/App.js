import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* بعد الدخول: لو أدمن يروح داشبورد، لو يوزر يروح Welcome */}
        <Route
          path="/dashboard"
          element={
            token && role === "admin" ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/welcome"
          element={
            token && role === "user" ? <Welcome /> : <Navigate to="/" replace />
          }
        />

        {/* مسارات غير معروفة */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
