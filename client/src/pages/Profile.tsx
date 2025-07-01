import { getUserProfile } from "@/utils/userService";
import { useEffect, useState } from "react";
import Dropdown from "@/components/profile-components/Dropdown";
import EditProfile from "@/components/profile-components/EditProfile";

interface Profile {
  bio: string;
  email: string;
  location: string;
  profile_img_url: string;
  sports: Array<string>;
  username: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const retrievedProfile = await getUserProfile();
      setProfile(retrievedProfile);
      setLoading(false);
    };
    fetchProfile();
  }, [profile]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="grow-1 overflow-auto w-screen p-8 relative text-white">
      <Dropdown setEditing={setEditing} />
      {!profile.profile_img_url ? (
        <></>
      ) : (
        <img src={profile.profile_img_url} alt="" />
      )}
      <h1 className="text-4xl m-3">{profile.username}</h1>
      <h2 className="text-xl">Location: {profile.location}</h2>
      <p className="text-l">{profile.bio}</p>
      <h2 className="text-xl">Interests:</h2>
      <ul>
        {profile.sports.map((sport: string, index) => {
          return <li key={index}>{sport}</li>;
        })}
      </ul>
      {editing ? <EditProfile /> : <></>}
    </div>
  );
};

export default Profile;
