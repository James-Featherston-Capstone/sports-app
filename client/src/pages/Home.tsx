import { useEffect } from "react";
import { loginStatus } from "../utils/authService";

const Home = () => {
  const fetchUser = async () => {
    const user = await loginStatus();
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return <div>Home</div>;
};

export default Home;
