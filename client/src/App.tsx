import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Header from "./components/Header";
import Footer from "./components/Footer";
import withAuth from "./components/Protected";
import withAuthBar from "./components/ProtectedBar";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const ProtectedEvents = withAuth(Events);
  const ProtectedHeader = withAuthBar(Header);
  const ProtectedFooter = withAuthBar(Footer);
  const ProtectedProfile = withAuth(ProfilePage);
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
