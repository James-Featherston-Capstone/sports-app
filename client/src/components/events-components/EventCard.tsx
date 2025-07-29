import { useState } from "react";
import { Button } from "../ui/button";
import EventModify from "./EventModify";
import type { DisplayEvent } from "@/utils/interfaces";
import { clickEvent, deleteEventRsvp, eventRsvp } from "@/utils/eventService";
import { getEvent } from "@/utils/eventService";
import { useDialogContext } from "@/contexts/globalDialogContext";
import EventModalContent from "./EventModalContent";
import { useEventContext } from "@/contexts/eventContext";
import { getDisplayDate } from "@/utils/utils";
import ButtonAnimation from "../ButtonAnimation";

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

  const handleRsvp = () => {
    if (!isRsvpByCurrentUser) {
      eventRsvp(event.id);
    } else {
      deleteEventRsvp(event.id);
    }
    setIsRsvpByCurrentUser(!isRsvpByCurrentUser);
  };
  const handleOpenEventViewModal = async () => {
    if (event.distance !== undefined) {
      clickEvent(event.id, event.distance);
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
      <div
        className="w-1/1 max-w-110 h-60 flex flex-col justify-around text-black p-2 m-1 rounded-2xl hover:cursor-context-menu border-2 shadow-md"
        onClick={() => handleOpenEventViewModal()}
      >
        <h1 className="mt-2 text-xl">{displayedEvent.sport}</h1>
        <div className="w-1/1">
          <h1>{getDisplayDate(displayedEvent.eventTime)}</h1>
          <h1>{displayedEvent.location}</h1>
          <h1></h1>
          {displayedEvent.distance !== undefined && (
            <h1>Distance: {displayedEvent.distance} Miles</h1>
          )}
        </div>
        <div>
          {areEventsEditable ? (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEventEditModal();
              }}
            >
              EDIT
            </Button>
          ) : (
            <></>
          )}
          <ButtonAnimation
            handleRsvp={handleRsvp}
            isRsvp={isRsvpByCurrentUser ? isRsvpByCurrentUser : false}
            event={event}
          />
        </div>
      </div>
    </>
  );
};

export default EventCard;
