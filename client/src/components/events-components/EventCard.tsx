import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import EventModify from "./EventModify";
import type { EventWithRsvp } from "@/utils/interfaces";
import { deleteEventRsvp, eventRsvp } from "@/utils/eventService";

interface EventProps {
  event: EventWithRsvp;
  eventEditable: boolean;
}

const EventCard = ({ event, eventEditable }: EventProps) => {
  const [isEditing, setIsEditing] = useState(false);
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

  return (
    <>
      <Card className="flex flex-col justify-start items-center w-9/10 sm:w-75 m-w-50 h-50 sm:h-100 m-3 p-1.5 border rounded-xl text-black">
        <CardDescription>
          <h1 className="text-black">{displayedEvent.description}</h1>
        </CardDescription>
        <CardContent>
          <h1>Time: {displayedEvent.eventTime}</h1>
          <h1>Location: {displayedEvent.location}</h1>
          <h1>Sport: {displayedEvent.sport}</h1>
        </CardContent>
        <CardFooter>
          {eventEditable ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
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
      {isEditing && (
        <EventModify
          open={isEditing}
          onOpenChange={setIsEditing}
          baseEvent={displayedEvent}
          updateDisplayedEvent={setDisplayedEvent}
        />
      )}
    </>
  );
};

export default EventCard;
