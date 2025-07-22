import { useLoginContext } from "@/contexts/loginContext";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/profile-components/ProfileForm";
import type { Profile } from "@/utils/interfaces";
import { createProfile } from "@/utils/profileService";
import { register } from "../utils/authService";
import { useState } from "react";

interface ProfileProps {
  editing: boolean;
  type: string;
  onReturn: (status: boolean) => void;
  profile: Profile;
  setProfile: (current: Profile) => void;
  password?: string;
}

const EditProfile = ({
  editing,
  type,
  onReturn,
  profile,
  setProfile,
  password,
}: ProfileProps) => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [newProfile, setNewProfile] = useState<Profile>(profile);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (type === "create") {
      if (newProfile.location === "") {
        setErrorMessage("Must set a location");
      } else {
        if (password) {
          const user = await register(newProfile, password);
          if (user) {
            setLoginStatus(true);
            navigate("/");
          } else {
            setErrorMessage("User creation failed.");
          }
        }
      }
    } else {
      const user = await createProfile(newProfile);
      setProfile(newProfile);
      if (user) {
        onReturn(false);
      }
    }
  };
  if (!editing) {
    return <></>;
  }
  return (
    <div className="flex flex-col grow-1 w-screen h-screen items-center justify-center bg-black fixed pt-20">
      <div className="absolute top-6 left-4" onClick={() => onReturn(false)}>
        <span className="material-symbols-outlined">
          {type === "edit" && <h1 className="text-4xl">chevron_left</h1>}
        </span>
      </div>
      <h1 className="text-4xl">
        {type === "create" ? "Create Profile" : "Edit Profile"}
      </h1>
      {type === "create" && (
        <h2 className="text-l my-2">
          Profile can be changed later in settings
        </h2>
      )}
      <ProfileForm
        onSubmit={onSubmit}
        profile={newProfile}
        setProfile={setNewProfile}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default EditProfile;
