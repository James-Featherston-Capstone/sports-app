import { useLoginContext } from "@/contexts/loginContext";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/profile-components/ProfileForm";
import type { Profile } from "@/utils/interfaces";
import { createProfile } from "@/utils/profileService";
import { useState } from "react";

interface ProfileProps {
  editing: boolean;
  type: string;
  onReturn: (status: boolean) => void;
  profile: Profile;
  setProfile: (current: Profile) => void;
  password: string;
}

const EditProfile = ({
  editing,
  type,
  onReturn,
  profile,
  setProfile,
}: ProfileProps) => {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoginContext();
  const [newProfile, setNewProfile] = useState<Profile>(profile);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (type === "create") {
      const user = await createProfile(newProfile);
      if (user) {
        setLoginStatus(true);
        navigate("/events");
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
          <h1 className="text-4xl">chevron_left</h1>
        </span>
      </div>
      <h1 className="text-4xl">Profile Settings</h1>
      <ProfileForm
        onSubmit={onSubmit}
        profile={newProfile}
        setProfile={setNewProfile}
      />
    </div>
  );
};

export default EditProfile;
