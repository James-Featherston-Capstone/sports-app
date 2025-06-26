import { useEffect, useState } from "react";
import InputCustom from "@/components/Input";
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
    const performStatusCheck = async () => {
      if (await checkStatus()) {
        setLoginStatus(true);
        navigate("/events");
      }
    };
    performStatusCheck();
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
    <div className="container border-2 w-5/10 h-5/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-lg">Login to Team Up</h1>
      <form
        className="flex justify-center flex-col items-start"
        onSubmit={handleLogin}
      >
        <label> Email: </label>
        <InputCustom value={email} setValue={setEmail} type="text" />
        <label> Password: </label>
        <InputCustom value={password} setValue={setPassword} type="password" />
        <Button type="submit" className="w-100 m-1">
          Login
        </Button>
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Don't have an account?{" "}
        <Button variant="link" onClick={() => navigate("/register")}>
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;
