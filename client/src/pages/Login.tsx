import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Make API call
    // Set login state to true
    console.log("Logged In");
  };
  return (
    <div className="container border-2 w-5/10 h-5/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-lg">Login to Team Up</h1>
      <form
        className="flex justify-center flex-col items-start"
        onSubmit={handleLogin}
      >
        <label> Email: </label>
        <Input value={email} setValue={setEmail} type="text" />
        <label> Password: </label>
        <Input value={password} setValue={setPassword} type="password" />
        <button type="submit" className="w-100 m-1">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <a onClick={() => navigate("/register")}>Register</a>
      </p>
    </div>
  );
};

export default Login;
