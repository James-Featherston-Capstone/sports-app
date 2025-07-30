import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SportsOptions from "./SportsOptions";
import type { Profile } from "@/utils/interfaces";
import MapsInput from "../MapsInput";

interface ProfileFormComponents {
  onSubmit: (event: React.FormEvent) => void;
  profile: Profile;
  setProfile: (current: Profile) => void;
  errorMessage: string;
}

const ProfileForm = ({
  onSubmit,
  profile,
  setProfile,
  errorMessage,
}: ProfileFormComponents) => {
  return (
    <form
      action="submit"
      onSubmit={onSubmit}
      className="w-screen p-3 grow-1 flex flex-col items-center mb-5"
    >
      <label className="self-start ml-1"> Biography: </label>
      <Input
        type="text"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        autoComplete="on"
        placeholder="Create a Bio"
        required
      />
      <label className="self-start ml-1">Location:</label>
      <MapsInput
        baseLatitude={parseFloat(profile.latitude)}
        baseLongitude={parseFloat(profile.longitude)}
        setLocation={(location) =>
          setProfile({ ...profile, location: location })
        }
        showMap={true}
      />

      <label className="self-start ml-1">Profile Picture URL (Optional):</label>
      <Input
        type="text"
        value={profile.profile_image_url}
        onChange={(e) =>
          setProfile({ ...profile, profile_image_url: e.target.value })
        }
        autoComplete="on"
        placeholder="Pfp URL"
      />
      <label> Sports: </label>
      <SportsOptions profile={profile} setProfile={setProfile} />
      <h1 className="text-red-600 text-lg">{errorMessage}</h1>
      <Button variant="secondary" type="submit" className=" w-7/10">
        Submit
      </Button>
    </form>
  );
};

export default ProfileForm;
