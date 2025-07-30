import { getUserProfile } from "@/utils/userService";
import { useEffect, useState } from "react";
import Dropdown from "@/components/profile-components/Dropdown";
import EditProfile from "./EditProfile";
import type { Profile } from "@/utils/interfaces";
import UserAvatar from "@/components/UserAvatar";
import LoadingCircleSpinner from "@/components/Spinner";

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
    return (
      <h1 className="grow-1">
        <LoadingCircleSpinner />
      </h1>
    );
  }
  return (
    <div className="grow-1 overflow-auto w-screen p-8 relative display flex flex-col justify-start items-center">
      <Dropdown setEditing={setIsEditing} />
      <div className="w-50 h-50 max-h-50 max-w-50">
        <UserAvatar user={profile} diameter={50} />
      </div>
      <h1 className="text-4xl mt-3">{profile.username}</h1>
      <div className="w-9/10 max-w-125 h-0.25 bg-black my-2" />

      <div className="w-8/10 max-w-125">
        <p className="text-l text-start px-2">{profile.bio}</p>
      </div>

      <h1 className="mt-2 text-lg font-bold">Your Location:</h1>
      <h2 className="text-xl w-9/10">{profile.location}</h2>
      <h2 className="text-xl font-bold mt-2">Interests:</h2>
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
