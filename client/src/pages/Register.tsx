import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { register } from "../utils/authService";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "../utils/authService";

const Register = () => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [password, setPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");
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

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== testPassword) {
      setError(true);
      setErrorMessage("Passwords Do Not Match");
    } else {
      const user = await register({ email: email, password: password });
      if (user) {
        setLoginStatus(true);
        navigate("/events");
      }
    }
  };
  return (
    <div className="container border-2 w-5/10 h-5/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-xl">Create a Team Up Account</h1>
      <form
        className="flex justify-center flex-col items-start"
        onSubmit={handleRegister}
      >
        <label> Email: </label>
        <Input value={email} setValue={setEmail} type="text" />
        <label> Password: </label>
        <Input value={password} setValue={setPassword} type="password" />
        <label> Confirm Password: </label>
        <Input
          value={testPassword}
          setValue={setTestPassword}
          type="password"
        />
        <button type="submit" className="w-100 m-1">
          Register
        </button>
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Already have an account? <a onClick={() => navigate("/login")}>Login</a>
      </p>
    </div>
  );
};

export default Register;
