import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "../utils/authService";
import { Button } from "@/components/ui/button";
import EditProfile from "./EditProfile";
import type { Profile } from "@/utils/interfaces";
import { register } from "../utils/authService";

const Register = () => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [password, setPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    bio: "",
    email: "",
    username: "",
    location: "",
    latitude: "0.0",
    longitude: "0.0",
    sports: [],
    profile_image_url: "",
  });
  useEffect(() => {
    if (checkStatus()) {
      setLoginStatus(true);
      navigate("/events");
    }
  }, []);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== testPassword) {
      setError(true);
      setErrorMessage("Passwords Do Not Match");
    } else {
      const user = await register(profile, password);
      if (user) {
        setCreatingProfile(true);
      }
      setError(true);
      setErrorMessage("Email is already in use");
    }
  };
  return (
    <div className="container border-2 w-9/10 md:w-5/10 h-8/10 p-1 md:p-6 md:h-6/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-xl mx-3">Create a Team Up Account</h1>
      <form
        className="flex justify-center flex-col items-start w-9/10"
        onSubmit={handleRegister}
      >
        <label className="my-3"> Username: </label>
        <Input
          className="mb-3 mt-.5"
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          autoComplete="on"
          placeholder="Username"
        />
        <label> Email: </label>
        <Input
          className="mb-3 mt-.5"
          type="text"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          autoComplete="on"
          placeholder="someone@gmail.com"
        />
        <label> Password: </label>
        <Input
          className="mb-3 mt-.5"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
        />
        <label> Confirm Password: </label>
        <Input
          className="mb-3 mt-.5"
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
        />
        <Button type="submit" className="w-1/1 mx-0 my-1.5" variant="secondary">
          Register
        </Button>
        {error ? (
          <p className="text-red-500 self-center">{errorMessage}</p>
        ) : (
          <></>
        )}
      </form>
      <p>
        Already have an account?
        <Button
          variant="link"
          className="text-white"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </p>
      <EditProfile
        onReturn={setCreatingProfile}
        editing={creatingProfile}
        type="create"
        profile={profile}
        setProfile={setProfile}
        password={password}
      />
    </div>
  );
};

export default Register;
