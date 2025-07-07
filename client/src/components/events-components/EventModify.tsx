import { Calendar } from "../ui/calendar";
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";
import { getDateTime, getTimeOfDay } from "../../utils/utils";
import { createEvent, editEvent } from "@/utils/eventService";
import type { Event } from "@/utils/interfaces";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EventModifyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreatingEvent: boolean;
  baseEvent: Event;
  updateDisplayedEvent: (event: Event) => void;
}

const sportsOptions = [
  "SOCCER",
  "FOOTBALL",
  "BASKETBALL",
  "BASEBALL",
  "TENNIS",
  "PICKLEBALL",
  "SOFTBALL",
  "RACQUETBALL",
  "FRISBEE",
  "VOLLEYBALL",
  "GOLF",
  "HOCKEY",
];

const EventModify = ({
  open,
  onOpenChange,
  isCreatingEvent,
  baseEvent,
  updateDisplayedEvent,
}: EventModifyProps) => {
  const [description, setDescription] = useState(
    baseEvent.id ? baseEvent.description : ""
  );
  const [sport, setSport] = useState(
    baseEvent.id ? baseEvent.sport.toUpperCase() : ""
  );
  const [eventImage, setEventImage] = useState(
    baseEvent.id ? baseEvent.eventImage : ""
  );
  const [eventTime, setEventTime] = useState(
    baseEvent.id ? getTimeOfDay(baseEvent.eventTime) : "12:00"
  );
  const [eventLocation, setEventLocation] = useState(
    baseEvent.id ? baseEvent.location : ""
  );
  const [date, setDate] = useState<Date | undefined>(
    baseEvent.id ? new Date(baseEvent.eventTime) : new Date()
  );

  const handleEventModify = async (e: FormEvent) => {
    e.preventDefault();
    const eventChanges = {
      description: description,
      sport: sport,
      eventImage: eventImage ? eventImage : "",
      eventTime: getDateTime(eventTime, date).toISOString(),
      location: eventLocation,
    };
    const event: Event = baseEvent.id
      ? { ...baseEvent, ...eventChanges }
      : eventChanges;
    if (isCreatingEvent) {
      createEvent(event);
    } else {
      editEvent(event);
      updateDisplayedEvent(event);
    }
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black flex flex-col items-center">
        <form onSubmit={handleEventModify}>
          <DialogHeader>
            <DialogTitle className="my-2">Modify an Event</DialogTitle>
            <DialogDescription>
              Fill out the form to update an event
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            value={description}
            aria-describedby="Description"
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="on"
            placeholder="Event Description"
            required
            className="my-1"
          />
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="w-1/1 my-0.5">
              <SelectValue placeholder="Choose Sport" />
            </SelectTrigger>
            <SelectContent>
              {sportsOptions.map((sport) => {
                return (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={eventImage}
            onChange={(e) => setEventImage(e.target.value)}
            autoComplete="on"
            placeholder="Set Event Image URL"
            className="my-1"
          />
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border bg-white"
            disabled={(date) => date < new Date()}
          />
          <Input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="my-1"
          />
          <Input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            autoComplete="on"
            placeholder="Set Location"
            required
            className="my-1"
          />
          <Button className="w-1/1 mx-0 my-1" type="submit">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModify;
