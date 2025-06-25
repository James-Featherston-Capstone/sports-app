import { useEffect, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/authService";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "../utils/authService";

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
    console.log(user);
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
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Don't have an account?{" "}
        <a onClick={() => navigate("/register")}>Register</a>
      </p>
    </div>
  );
};

export default Login;
