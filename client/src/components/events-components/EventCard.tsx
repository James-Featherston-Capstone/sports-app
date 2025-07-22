import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import EventModify from "./EventModify";
import type { DisplayEvent } from "@/utils/interfaces";
import { clickEvent, deleteEventRsvp, eventRsvp } from "@/utils/eventService";
import { getEvent } from "@/utils/eventService";
import { useDialogContext } from "@/contexts/globalDialogContext";
import EventModalContent from "./EventModalContent";
import { useEventContext } from "@/contexts/eventContext";
import { getDisplayDate } from "@/utils/utils";

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
    if (event.distance !== undefined) {
      await clickEvent(event.id, event.distance);
    }
    const fullEvent = await getEvent(event.id);
    openDialog({
      title: `${fullEvent.sport}`,
      description: fullEvent.description,
      reactChildren: (
        <EventModalContent
          event={fullEvent}
          updateDisplayedEvent={setDisplayedEvent}
        />
      ),
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
        className="flex flex-col justify-around items-center w-9/10 sm:w-75 m-w-50 min-h-50 sm:h-100 m-3 p-1.5 border rounded-xl text-black"
      >
        <CardTitle className="mt-2">{displayedEvent.sport}</CardTitle>
        <CardContent>
          <h1>{getDisplayDate(displayedEvent.eventTime)}</h1>
          <h1>{displayedEvent.location}</h1>
          <h1></h1>
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
