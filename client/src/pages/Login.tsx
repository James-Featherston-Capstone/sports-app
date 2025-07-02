import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/authService";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "../utils/authService";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (checkStatus()) {
      setLoginStatus(true);
      navigate("/events");
    }
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await login({ password: password, email: email });
    if (!user) {
      setError(true);
      setErrorMessage("Username or password Incorrect");
    } else {
      setLoginStatus(true);
      navigate("/events");
    }
  };

  return (
    <div className="container border-2 w-9/10 md:w-5/10 h-5/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-lg">Login to Team Up</h1>
      <form
        className="flex justify-center flex-col items-start w-9/10"
        onSubmit={handleLogin}
      >
        <label> Email: </label>
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
          placeholder="someone@gmail.com"
        />
        <label> Password: </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
        />
        <Button type="submit" className="w-1/1 mx-0 my-1" variant="secondary">
          Login
        </Button>
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Don't have an account?
        <Button
          variant="link"
          className="text-white"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;
