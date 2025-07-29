import { useLocation, useNavigate } from "react-router-dom";

const selectedButtonStyling =
  "text-4xl shadow-lg p-1.5 rounded-sm border-2 border-gray-300";
const nonSelectedButtonStyling = "text-4xl p-1.5 border-2 border-transparent";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="bg-white/70 z-10 backdrop-blur-md flex justify-center sm:justify-end items-center shadow-sm w-screen p-5 px-8 order-1 sm:order-0 border-t-2 border-b-0 sm:border-b-2 sm:border-t-0 border-black">
      <h1 className="justify-self-start text-3xl font-bold ml-8 hidden sm:block">
        Team Up
      </h1>
      <div className="flex-grow-0 sm:flex-grow-1"></div>
      <nav className="flex flex-row justify-around w-1/1 sm:w-auto h-15 items-center">
        <div onClick={() => navigate("/")} className="hover:cursor-pointer">
          <h3 className="text-2xl font-bold mx-8 hidden sm:block">Events</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1
                className={
                  location.pathname === "/"
                    ? "text-4xl shadow-lg p-1.5 rounded-sm border-2 border-gray-300"
                    : nonSelectedButtonStyling
                }
              >
                event
              </h1>
            </span>
          </i>
        </div>
        <div
          onClick={() => navigate("/friends")}
          className="hover:cursor-pointer"
        >
          <h3 className="text-2xl font-bold mx-8 hidden sm:block">Friends</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1
                className={
                  location.pathname === "/friends"
                    ? selectedButtonStyling
                    : nonSelectedButtonStyling
                }
              >
                person
              </h1>
            </span>
          </i>
        </div>
        <div
          onClick={() => navigate("/profile")}
          className="hover:cursor-pointer"
        >
          <h3 className="text-2xl font-bold mx-8 hidden sm:block">Profile</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1
                className={
                  location.pathname === "/profile"
                    ? selectedButtonStyling
                    : nonSelectedButtonStyling
                }
              >
                settings
              </h1>
            </span>
          </i>
        </div>
      </nav>
    </header>
  );
};

export default Header;
