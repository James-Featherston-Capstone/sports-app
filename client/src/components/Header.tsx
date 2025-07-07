import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="min-h-15 flex justify-center sm:justify-end items-center bg-amber-700 w-screen p-5 order-1 sm:order-0">
      <h1 className="justify-self-start text-2xl font-bold ml-5 hidden sm:block">
        Team Up
      </h1>
      <div className="flex-grow-0 sm:flex-grow-1"></div>
      <nav className="flex flex-row justify-around w-1/1 sm:w-auto">
        <div onClick={() => navigate("/events")}>
          <h3 className="text-xl font-bold m-3 hidden sm:block">Events</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1 className="text-3xl">event</h1>
            </span>
          </i>
        </div>
        <div onClick={() => navigate("/athletes")}>
          <h3 className="text-xl font-bold m-3 hidden sm:block">Athletes</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1 className="text-3xl">account_box</h1>
            </span>
          </i>
        </div>

        <div onClick={() => navigate("/profile")}>
          <h3 className="text-xl font-bold m-3 hidden sm:block">Profile</h3>
          <i className="block sm:hidden">
            <span className="material-symbols-outlined">
              <h1 className="text-3xl">settings</h1>
            </span>
          </i>
        </div>
      </nav>
    </header>
  );
};

export default Header;
