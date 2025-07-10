import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import EventModify from "./EventModify";
import type { DisplayEvent } from "@/utils/interfaces";
import { deleteEventRsvp, eventRsvp } from "@/utils/eventService";
import { getEvent } from "@/utils/eventService";
import { useDialogContext } from "@/contexts/globalDialogContext";
import EventModalContent from "./EventModalContent";
import { useEventContext } from "@/contexts/eventContext";

interface EventProps {
  event: DisplayEvent;
}

const EventCard = ({ event }: EventProps) => {
  const { openDialog } = useDialogContext();
  const { areEventsEditable } = useEventContext();
  const [displayedEvent, setDisplayedEvent] = useState(event);
  const [isRsvpByCurrentUser, setIsRsvpByCurrentUser] = useState(
    event.isRsvpCurrentUser
  );

  const handleRsvp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isRsvpByCurrentUser) {
      eventRsvp(event.id);
    } else {
      deleteEventRsvp(event.id);
    }
    setIsRsvpByCurrentUser(!isRsvpByCurrentUser);
  };
  const handleOpenEventViewModal = async () => {
    const fullEvent = await getEvent(event.id);
    openDialog({
      title: `${fullEvent.sport} at ${fullEvent.location}`,
      description: fullEvent.description,
      reactChildren: <EventModalContent event={fullEvent} />,
    });
  };
  const handleOpenEventEditModal = () => {
    openDialog({
      title: "Modify an Event",
      description: "Fill out the form to update an event",
      reactChildren: (
        <EventModify
          baseEvent={event}
          updateDisplayedEvent={setDisplayedEvent}
        />
      ),
    });
  };
  return (
    <>
      <Card
        onClick={() => handleOpenEventViewModal()}
        className="flex flex-col justify-start items-center w-9/10 sm:w-75 m-w-50 h-50 sm:h-100 m-3 p-1.5 border rounded-xl text-black"
      >
        <CardDescription>
          <h1 className="text-black">{displayedEvent.description}</h1>
        </CardDescription>
        <CardContent>
          <h1>Time: {displayedEvent.eventTime}</h1>
          <h1>Location: {displayedEvent.location}</h1>
          <h1>Sport: {displayedEvent.sport}</h1>
          {displayedEvent.distance !== undefined && (
            <h1>Distance: {displayedEvent.distance} Miles</h1>
          )}
        </CardContent>
        <CardFooter>
          {areEventsEditable ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEventEditModal();
              }}
            >
              Edit
            </Button>
          ) : (
            <></>
          )}
          <Button
            variant={isRsvpByCurrentUser ? "checked" : "default"}
            className="h-8"
            onClick={handleRsvp}
          >
            RSVP
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default EventCard;
