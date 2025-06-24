import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="min-h-15 flex justify-end items-center bg-amber-700 w-screen p-5">
      <h1 className="justify-self-start text-2xl font-bold ml-5">Team Up</h1>
      <div className="flex-grow-1"></div>
      <nav className="flex flex-row mr-8">
        <h3
          className="text-xl font-bold m-3"
          onClick={() => navigate("/events")}
        >
          Events
        </h3>
        <h3
          className="text-xl font-bold m-3"
          onClick={() => navigate("/athletes")}
        >
          Athletes
        </h3>
        <h3
          className="text-xl font-bold m-3"
          onClick={() => navigate("/profile")}
        >
          Profile
        </h3>
      </nav>
    </header>
  );
};

export default Header;
