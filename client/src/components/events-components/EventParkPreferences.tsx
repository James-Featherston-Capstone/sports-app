import { useState } from "react";
import { Button } from "../ui/button";
import MapsInput from "../MapsInput";
import type { ParkPreference } from "@/utils/interfaces";
import { createEventPreference, upvotePreference } from "@/utils/eventService";

interface EventParkPreferencesProps {
  eventId: number;
  preferenceList: ParkPreference[];
  setPreferenceList: (preferences: ParkPreference[]) => void;
}
const EventParkPreferences = ({
  preferenceList,
  setPreferenceList,
  eventId,
}: EventParkPreferencesProps) => {
  const [newPreferenceLocation, setNewPreferenceLocation] = useState("");
  const handleNewParkPreference = async () => {
    const newPreference = await createEventPreference(
      eventId,
      newPreferenceLocation
    );
    setPreferenceList([newPreference, ...preferenceList]);
  };

  const handleUpvote = async (preferenceId: number) => {
    const updatedPreference = await upvotePreference(preferenceId);
    const updatedPreferenceList = preferenceList.map((preference) =>
      preference.id === preferenceId ? updatedPreference : preference
    );
    setPreferenceList(updatedPreferenceList);
  };
  return (
    <>
      <div className="flex flex-row flex-wrap">
        <MapsInput
          location={newPreferenceLocation}
          setLocation={setNewPreferenceLocation}
          showMap={false}
        />
        <Button className="w-1/1 mx-0" onClick={handleNewParkPreference}>
          Submit
        </Button>
      </div>
      {preferenceList.map((preference) => {
        return (
          <div className="bg-white rounded-sm my-0.5 p-0.5 flex">
            <div className="grow-1">
              <h1>{preference.location}</h1>
            </div>
            <div>
              <p className="text-center">{preference.upvotes}</p>
              <Button
                className="p-0.25 h-auto "
                onClick={() => handleUpvote(preference.id)}
              >
                Upvote
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default EventParkPreferences;
