import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Header from "./components/Header";
import Footer from "./components/Footer";
import withAuth from "./components/Protected";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const ProtectedEvents = withAuth(Events, true);
  const ProtectedHeader = withAuth(Header, false);
  const ProtectedFooter = withAuth(Footer, false);
  const ProtectedProfile = withAuth(ProfilePage, true);
  return (
    <div className="app w-screen">
      <ProtectedHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<ProtectedEvents />} />
        <Route path="/profile" element={<ProtectedProfile />} />
      </Routes>
      <ProtectedFooter />
    </div>
  );
}

export default App;
