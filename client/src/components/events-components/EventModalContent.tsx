import type {
  DisplayEvent,
  Comment,
  ParkPreference,
  ParkRecommendation,
} from "@/utils/interfaces";
import { Button } from "../ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import EventComments from "./EventComments";
import EventParkPreferences from "./EventParkPreferences";
import ParkRecommendations from "./ParkRecommendations";
import {
  editEvent,
  getAllEventPreferences,
  getEventLocationRecommendations,
} from "@/utils/eventService";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "../ui/menubar";
import EventParkDetails from "./EventParkDetails";

interface EventModalContentType {
  event: DisplayEvent;
  updateDisplayedEvent: Dispatch<SetStateAction<DisplayEvent>>;
}

const viewTypes = {
  comments: 0,
  enterPreferences: 1,
  viewRecommendedParks: 2,
  eventDetails: 3,
};

const EventModalContent = ({
  event,
  updateDisplayedEvent,
}: EventModalContentType) => {
  const [location, setLocation] = useState(event.location);
  const [commentList, setCommentList] = useState<Comment[]>(event.comments);
  const [preferenceList, setPreferenceList] = useState<ParkPreference[]>([]);
  const [preferenceListSet, setPreferenceListSet] = useState(false);
  const [recommendationList, setRecommendationList] = useState<
    ParkRecommendation[]
  >([]);
  const [isRecommendationListSet, setIsRecommendationListSet] = useState(false);
  const [viewType, setViewType] = useState<number>(viewTypes.comments);
  const handleToggleEventDetails = () => {
    setViewType(viewTypes.eventDetails);
  };

  const handleCommentToggle = () => {
    setViewType(viewTypes.comments);
  };

  const handlePreferenceViewToggle = async () => {
    setViewType(viewTypes.enterPreferences);
    if (!preferenceListSet) {
      const retrievedPreferenceList = await getAllEventPreferences(event.id);
      setPreferenceList(retrievedPreferenceList);
      setPreferenceListSet(true);
    }
  };
  const handleRecommendParksToggle = async () => {
    setViewType(viewTypes.viewRecommendedParks);
    if (!isRecommendationListSet) {
      await generateRecommendations();
    }
  };
  const generateRecommendations = async () => {
    setIsRecommendationListSet(false);
    const retrievedRecommendations = await getEventLocationRecommendations(
      event.id
    );
    setRecommendationList(retrievedRecommendations);
    setIsRecommendationListSet(true);
  };
  const updateLocation = (location: string) => {
    const updatedEvent: DisplayEvent = { ...event, location };
    editEvent(updatedEvent);
    updateDisplayedEvent(updatedEvent);
    setLocation(location);
  };
  return (
    <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto">
      <div className="grow-1 flex flex-col">
        <Menubar className="mb-2 flex justify-around">
          <MenubarMenu>
            <Button
              className="p-0 mx-1"
              variant="ghost"
              disabled={viewType === viewTypes.eventDetails}
              onClick={handleToggleEventDetails}
            >
              Event Details
            </Button>
            <Button
              className="p-0 mx-1"
              variant="ghost"
              onClick={handleCommentToggle}
              disabled={viewType === viewTypes.comments}
            >
              Comments
            </Button>
            <MenubarTrigger>Parks</MenubarTrigger>
            <MenubarContent className="p-0">
              <MenubarItem className="px-2 py-0 m-0">
                <Button
                  className="p-0 m-0"
                  variant="ghost"
                  onClick={handlePreferenceViewToggle}
                  disabled={viewType === viewTypes.enterPreferences}
                >
                  Park Preferences
                </Button>
              </MenubarItem>
              <MenubarSeparator className="my-0" />
              <MenubarItem className="px-2 py-0 m-0">
                <Button
                  className="p-0 m-0"
                  variant="ghost"
                  onClick={handleRecommendParksToggle}
                  disabled={viewType === viewTypes.viewRecommendedParks}
                >
                  Park Recommendations
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className="w-1/1">
          {viewType === viewTypes.eventDetails && (
            <EventParkDetails event={event} location={location} />
          )}
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
              isLoading={!preferenceListSet}
            />
          )}
          {viewType === viewTypes.viewRecommendedParks && (
            <ParkRecommendations
              isLoading={!isRecommendationListSet}
              recommendationList={recommendationList}
              updateLocation={updateLocation}
              regenerateRecommendations={generateRecommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModalContent;
