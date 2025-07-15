import type { DisplayEvent, Comment, ParkPreference } from "@/utils/interfaces";
import { Button } from "../ui/button";
import { useState } from "react";
import EventComments from "./EventComments";
import EventParkPreferences from "./EventParkPreferences";
import { getAllEventPreferences } from "@/utils/eventService";

interface EventModalContentType {
  event: DisplayEvent;
}

const viewTypes = {
  comments: 0,
  enterPreferences: 1,
  viewRecommendedParks: 2,
};

const EventModalContent = ({ event }: EventModalContentType) => {
  const [commentList, setCommentList] = useState<Comment[]>(event.comments);
  const [preferenceList, setPreferenceList] = useState<ParkPreference[]>([]);
  const [preferenceListSet, setPreferenceListSet] = useState(false);
  const [viewType, setViewType] = useState<number>(viewTypes.comments);
  const handleCommentToggle = () => {
    setViewType(viewTypes.comments);
  };

  const handlePreferenceViewToggle = async () => {
    if (!preferenceListSet) {
      const retrievedPreferenceList = await getAllEventPreferences(event.id);
      setPreferenceList(retrievedPreferenceList);
      setPreferenceListSet(true);
    }
    setViewType(viewTypes.enterPreferences);
  };
  const handleRecommendParksToggle = () => {
    setViewType(viewTypes.viewRecommendedParks);
  };
  return (
    <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto">
      <div className="grow-0 md:grow-1">
        <h4>{event.description}</h4>
        <h3>Sport: {event.sport}</h3>
        <div className="flex">
          <h3>Rsvps:</h3>
          {event.rsvps &&
            event.rsvps.slice(0, 10).map((rsvp, index) => (
              <h3 className="mx-1" key={index}>
                {rsvp.user?.username},
              </h3>
            ))}
          ...
        </div>
      </div>
      <div className="grow-1 mt-2 flex flex-col">
        <div className="w-1/1 flex flex-row justify-around my-2 flex-wrap">
          <Button
            onClick={handleCommentToggle}
            className="m-1"
            disabled={viewType === viewTypes.comments}
          >
            Comments
          </Button>
          <Button
            onClick={handlePreferenceViewToggle}
            className="m-1"
            disabled={viewType === viewTypes.enterPreferences}
          >
            Park Preferences
          </Button>
          <Button
            onClick={handleRecommendParksToggle}
            className="m-1"
            disabled={viewType === viewTypes.viewRecommendedParks}
          >
            Park Recommendations
          </Button>
        </div>
        {viewType === viewTypes.comments && (
          <EventComments
            eventId={event.id}
            commentList={commentList}
            setCommentList={setCommentList}
          />
        )}
        {viewType === viewTypes.enterPreferences && (
          <EventParkPreferences
            eventId={event.id}
            preferenceList={preferenceList}
            setPreferenceList={setPreferenceList}
          />
        )}
        {viewType === viewTypes.viewRecommendedParks && (
          <div>These parks are recommended</div>
        )}
      </div>
    </div>
  );
};

export default EventModalContent;
