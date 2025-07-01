import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import EventCreation from "./EventCreation";
import type { EventType } from "@/utils/interfaces";

interface EventProps {
  event: EventType;
  owns: boolean;
}

const EventCard = ({ event, owns }: EventProps) => {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <Card className="flex flex-col justify-start items-center w-9/10 sm:w-75 m-w-50 h-50 sm:h-100 m-3 p-1.5 border rounded-xl text-black">
        <CardDescription>
          <h1 className="text-black">{event.description}</h1>
        </CardDescription>
        <CardContent>
          <h1>Time: {event.eventTime}</h1>
          <h1>Location: {event.location}</h1>
          <h1>Sport: {event.sport}</h1>
        </CardContent>
        <CardFooter>
          {owns ? <Button onClick={() => setEdit(true)}>Edit</Button> : <></>}
          <Button className="h-8">RSVP</Button>
        </CardFooter>
      </Card>
      {edit ? <EventCreation event={event} /> : <></>}
    </>
  );
};

export default EventCard;
