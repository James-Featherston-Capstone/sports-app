import { getUserProfile } from "@/utils/userService";
import { useEffect, useState } from "react";
import Dropdown from "@/components/profile-components/Dropdown";
import EditProfile from "./EditProfile";
import type { Profile } from "@/utils/interfaces";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const retrievedProfile = await getUserProfile();
      setProfile(retrievedProfile);
      setIsLoading(false);
    };
    fetchProfile();
  }, []);
  if (isLoading) {
    return <h1 className="grow-1">Loading...</h1>;
  }
  return (
    <div className="grow-1 overflow-auto w-screen p-8 relative text-white display flex flex-col justify-start items-center">
      <Dropdown setEditing={setIsEditing} />
      <div className="w-50 h-50 max-h-50 max-w-50">
        {!profile.profile_image_url ? (
          <img
            className="w-50 h-50 rounded-full"
            src={`https://avatar.iran.liara.run/username?username=${profile.username}`}
            alt=""
          />
        ) : (
          <img src={profile.profile_image_url} alt="" />
        )}
      </div>

      <h1 className="text-4xl m-3">{profile.username}</h1>
      <h2 className="text-xl">Location: {profile.location}</h2>
      <p className="text-l">{profile.bio}</p>
      <h2 className="text-xl">Interests:</h2>
      <ul>
        {profile.sports.map((sport: string, index: number) => {
          return <li key={index}>{sport}</li>;
        })}
      </ul>
      {isEditing ? (
        <EditProfile
          onReturn={setIsEditing}
          editing={isEditing}
          type="edit"
          profile={profile}
          setProfile={setProfile}
          password=""
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfilePage;
