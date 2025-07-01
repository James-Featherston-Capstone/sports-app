import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SportsOptions from "./SportsOptions";
import type { ProfileType } from "@/utils/interfaces";

interface ProfileFormComponents {
  onSubmit: (event: React.FormEvent) => void;
  profile: ProfileType;
  setProfile: (current: ProfileType) => void;
}

const ProfileForm = ({
  onSubmit,
  profile,
  setProfile,
}: ProfileFormComponents) => {
  return (
    <form
      action="submit"
      onSubmit={onSubmit}
      className="w-screen p-3 grow-1 flex flex-col items-center"
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
      <Input
        type="text"
        value={profile.location}
        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        autoComplete="on"
        placeholder="Location"
        required
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
      <Button variant="secondary" type="submit" className=" w-7/10">
        Submit
      </Button>
    </form>
  );
};

export default ProfileForm;
