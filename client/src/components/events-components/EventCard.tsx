import { Card, CardContent, CardDescription } from "../ui/card";

interface EventProps {
  event: Event;
}

interface Event {
  created_at: string;
  description: string;
  eventImage: string;
  eventTime: string;
  location: string;
  latitude: number;
  longitude: number;
  organizerId: number;
  id: number;
  sport: string;
  updated_at: string;
}

const EventCard = ({ event }: EventProps) => {
  return (
    <Card className="flex flex-col justify-start items-center w-9/10 sm:w-75 m-w-50 h-50 sm:h-100 m-3 p-1.5 border rounded-xl text-black">
      <CardDescription>
        <h1 className="text-black">{event.description}</h1>
      </CardDescription>
      <CardContent>
        <h1>Time: {event.eventTime}</h1>
        <h1>Location: {event.location}</h1>
        <h1>Sport: {event.sport}</h1>
      </CardContent>
    </Card>
  );
};

export default EventCard;
