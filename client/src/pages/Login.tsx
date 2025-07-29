import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/authService";
import { useLoginContext } from "../contexts/loginContext";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await login({ password: password, email: email });
    if (!user) {
      setError(true);
      setErrorMessage("Username or password Incorrect");
    } else {
      setLoginStatus(true);
      navigate("/");
    }
  };
  useEffect(() => {
    login({});
  }, []);

  return (
    <div className="container border-2 w-9/10 md:w-5/10 flex justify-center items-center rounded-md flex-col p-3 py-20">
      <h1 className="text-lg">Login to Team Up</h1>
      <form
        className="flex justify-center flex-col items-start w-9/10"
        onSubmit={handleLogin}
      >
        <label className="mt-2"> Email: </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
          placeholder="someone@gmail.com"
          className="mb-3"
        />
        <label className="mt-2"> Password: </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
          className="mb-3"
        />
        <Button type="submit" className="w-1/1 mx-0 my-3" variant="outline">
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
        <Button variant="link" onClick={() => navigate("/register")}>
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;
