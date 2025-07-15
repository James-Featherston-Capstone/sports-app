import { useState } from "react";
import { Button } from "../ui/button";
import MapsInput from "../MapsInput";

interface EventParkPreferencesProps {
  eventId: number;
  preferenceList: string[];
  setPreferenceList: (preferences: string[]) => void;
}
const EventParkPreferences = ({
  eventId,
  preferenceList,
  setPreferenceList,
}: EventParkPreferencesProps) => {
  const [newPreference, setNewPreference] = useState("");
  const handleNewParkPreference = () => {
    setPreferenceList([newPreference, ...preferenceList]);
  };
  return (
    <>
      <div className="flex flex-row flex-wrap">
        <MapsInput
          location={newPreference}
          setLocation={setNewPreference}
          useMap={false}
        />
        <Button className="w-1/1 mx-0" onClick={handleNewParkPreference}>
          Submit
        </Button>
      </div>
      {preferenceList.map((preference) => {
        return <h1>{preference}</h1>;
      })}
    </>
  );
};

export default EventParkPreferences;
