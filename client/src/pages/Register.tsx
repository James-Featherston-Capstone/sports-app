import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditProfile from "./EditProfile";
import type { Profile } from "@/utils/interfaces";
import { checkEmailAndUsername, login } from "../utils/authService";

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    bio: "",
    email: "",
    username: "",
    location: "",
    latitude: "0.0",
    longitude: "0.0",
    sports: [],
    profile_image_url: "",
  });

  const handleNext = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== testPassword) {
      setError(true);
      setErrorMessage("Passwords Do Not Match");
    } else {
      const result = await checkEmailAndUsername(
        profile.email,
        profile.username
      );
      if (result.emailInUse && result.usernameInUse) {
        setError(true);
        setErrorMessage("Email and username must be unique");
      } else if (result.emailInUse) {
        setError(true);
        setErrorMessage("Email must be unique");
      } else if (result.usernameInUse) {
        setError(true);
        setErrorMessage("Username must be unique");
      } else {
        setCreatingProfile(true);
      }
    }
  };
  useEffect(() => {
    login({});
  }, []);
  return (
    <div className="container border-2 w-9/10 md:w-5/10 h-8/10 p-1 md:p-6 md:h-6/10 flex justify-center items-center rounded-md flex-col">
      <h1 className="text-xl mx-3">Create a Team Up Account</h1>
      <form
        className="flex justify-center flex-col items-start w-9/10"
        onSubmit={handleNext}
      >
        <label className="my-3"> Username: </label>
        <Input
          className="mb-3 mt-.5"
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          autoComplete="on"
          placeholder="Username"
          required
        />
        <label> Email: </label>
        <Input
          className="mb-3 mt-.5"
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          autoComplete="on"
          placeholder="someone@gmail.com"
          required
        />
        <label> Password: </label>
        <Input
          className="mb-3 mt-.5"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
          required
        />
        <label> Confirm Password: </label>
        <Input
          className="mb-3 mt-.5"
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          autoComplete="on"
          placeholder="Password"
          required
        />
        <Button type="submit" className="w-1/1 mx-0 my-1.5" variant="secondary">
          Next
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
      {creatingProfile && (
        <EditProfile
          onReturn={setCreatingProfile}
          editing={creatingProfile}
          type="create"
          profile={profile}
          setProfile={setProfile}
          password={password}
        />
      )}
    </div>
  );
};

export default Register;
