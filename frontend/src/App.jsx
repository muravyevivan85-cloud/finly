import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Psychologists from "./pages/Psychologists";
import Articles from "./pages/Articles";
import Users from "./pages/Users";
import Health from "./pages/Health";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/psychologists" element={<Psychologists />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/health" element={<Health />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <main className="section">
              <div className="container">
                <h1>404</h1>
                <p>Страница не найдена.</p>
              </div>
            </main>
          }
        />
      </Routes>
      <footer className="footer">
        <div className="container">Psychology Platform</div>
      </footer>
    </>
  );
}
