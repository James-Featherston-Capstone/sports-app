import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import { DialogProvider } from "./contexts/globalDialogContext";
import { EventProvider } from "./contexts/eventContext";
import { FriendProvider } from "./contexts/friendContext";
import Friends from "./pages/Friends";

function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);
  return (
    <DialogProvider>
      <div className="app w-screen">
        {!hideLayout && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <EventProvider>
                <Events />
              </EventProvider>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/friends"
            element={
              <FriendProvider>
                <Friends />
              </FriendProvider>
            }
          />
        </Routes>
        {!hideLayout && <Footer />}
      </div>
    </DialogProvider>
  );
}

export default App;
