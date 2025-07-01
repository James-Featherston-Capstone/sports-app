import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/utils/userService";
import { useEffect, useState } from "react";

interface Profile {
  bio: string;
  email: string;
  location: string;
  profile_img_url: string;
  sports: Array<string>;
}

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const retrievedProfile = await getUserProfile();
      console.log(retrievedProfile);
      setProfile(retrievedProfile);
    };
    fetchProfile();
  }, []);
  return (
    <div className="h-1/1 p-8">
      <div className="fixed top-2 right-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="text-3xl">...</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h1></h1>
      Profile
    </div>
  );
};

export default Profile;
