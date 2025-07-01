import { Button } from "../ui/button";
import type { ProfileType } from "@/utils/interfaces";
const sportsOptions = [
  "SOCCER",
  "FOOTBALL",
  "BASKETBALL",
  "BASEBALL",
  "TENNIS",
  "PICKLEBALL",
  "SOFTBALL",
  "RACQUETBALL",
  "FRISBEE",
  "VOLLEYBALL",
  "GOLF",
  "HOCKEY",
];

interface SportProps {
  profile: ProfileType;
  setProfile: (current: ProfileType) => void;
}

const SportsOptions = ({ profile, setProfile }: SportProps) => {
  const handleToggle = (sport: string) => {
    if (profile.sports.includes(sport)) {
      setProfile({
        ...profile,
        sports: profile.sports.filter((opt) => opt !== sport),
      });
    } else {
      setProfile({ ...profile, sports: [...profile.sports, sport] });
    }
  };
  return (
    <ul className="flex flex-wrap justify-center m-1">
      {sportsOptions.map((sport) => {
        return (
          <li key={sport}>
            <Button
              variant={
                profile.sports.includes(sport) ? "selected" : "secondary"
              }
              className="my-0.5 mx-0.5 p-2"
              onClick={() => handleToggle(sport)}
              type="button"
            >
              {sport}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default SportsOptions;
