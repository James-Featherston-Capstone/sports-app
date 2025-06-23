import { useState } from "react";
import Input from "../components/Input";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted");
  };
  return (
    <div className="container border-2 w-5/10 h-5/10 flex justify-center items-center rounded-md">
      <form
        className="flex justify-center flex-col items-start"
        onSubmit={handleSubmit}
      >
        <label> Email: </label>
        <Input value={email} setValue={setEmail} />
        <label> Password: </label>
        <Input value={password} setValue={setPassword} />
        <button type="submit" className="w-100 m-1">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
