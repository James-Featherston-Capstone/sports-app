import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);
  return (
    <div className="app w-screen">
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
