import { useState } from "react";
import { Button } from "../ui/button";
import MapsInput from "../MapsInput";
import type { ParkPreference } from "@/utils/interfaces";
import { createEventPreference, upvotePreference } from "@/utils/eventService";
import LoadingCircleSpinner from "../Spinner";

interface EventParkPreferencesProps {
  eventId: number;
  preferenceList: ParkPreference[];
  setPreferenceList: (preferences: ParkPreference[]) => void;
  isLoading: boolean;
}
const EventParkPreferences = ({
  preferenceList,
  setPreferenceList,
  eventId,
  isLoading,
}: EventParkPreferencesProps) => {
  const [newPreferenceLocation, setNewPreferenceLocation] = useState("");
  const [message, setMessage] = useState("");
  const handleNewParkPreference = async () => {
    if (newPreferenceLocation.length === 0) {
      setMessage("Enter a valid location from the dropdown");
    } else {
      const newPreference = await createEventPreference(
        eventId,
        newPreferenceLocation
      );
      if (!newPreference.id) {
        setMessage("This park is already listed");
      } else {
        setMessage("");
        setPreferenceList([newPreference, ...preferenceList]);
        setNewPreferenceLocation("");
      }
    }
  };

  const handleUpvote = async (preferenceId: number) => {
    const updatedPreference = await upvotePreference(preferenceId);
    const updatedPreferenceList = preferenceList.map((preference) =>
      preference.id === preferenceId ? updatedPreference : preference
    );
    setPreferenceList(updatedPreferenceList);
  };
  if (isLoading) {
    return <LoadingCircleSpinner />;
  }
  return (
    <>
      <div className="flex flex-row flex-wrap justify-center">
        <MapsInput setLocation={setNewPreferenceLocation} showMap={false} />
        <Button className="w-1/1 mx-0" onClick={handleNewParkPreference}>
          Submit
        </Button>
        {message && (
          <p className="text-red-500 text-center text-lg bg-white px-2 m-1 rounded-2xl">
            {message}
          </p>
        )}
      </div>
      {preferenceList.length === 0 && (
        <h1 className="bg-white w-1/1 rounded-lg text-center p-1 my-2">
          Create a recommendation preference by typing an address in the input
          field.{" "}
        </h1>
      )}
      {preferenceList.map((preference) => {
        return (
          <div
            key={preference.id}
            className="bg-white rounded-sm my-0.5 p-0.5 flex"
          >
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
