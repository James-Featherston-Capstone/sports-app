import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputCustom from "@/components/Input";
import { register } from "../utils/authService";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "../utils/authService";
import { Button } from "@/components/ui/button";

const Register = () => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [password, setPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
      const user = await register({
        email: email,
        password: password,
        username: username,
      });
      if (user) {
        setLoginStatus(true);
        navigate("/events");
      }
    }
  };
  return (
    <div className="container border-2 w-5/10 h-5/10 min-h-fit flex justify-center items-center rounded-md flex-col">
      <h1 className="text-xl mx-3">Create a Team Up Account</h1>
      <form
        className="flex justify-center flex-col items-start w-85/100"
        onSubmit={handleRegister}
      >
        <label> Username: </label>
        <InputCustom value={username} setValue={setUsername} type="text" />
        <label> Email: </label>
        <InputCustom value={email} setValue={setEmail} type="text" />
        <label> Password: </label>
        <InputCustom value={password} setValue={setPassword} type="password" />
        <label> Confirm Password: </label>
        <InputCustom
          value={testPassword}
          setValue={setTestPassword}
          type="password"
        />
        <Button type="submit" className="w-1/1 mx-0 my-1.5">
          Register
        </Button>
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Already have an account?{" "}
        <Button variant="link" onClick={() => navigate("/login")}>
          Login
        </Button>
      </p>
    </div>
  );
};

export default Register;
