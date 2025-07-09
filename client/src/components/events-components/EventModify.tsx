import { Calendar } from "../ui/calendar";
import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import MapsInput from "../MapsInput";
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
import type { EventWithRsvp, Event } from "@/utils/interfaces";
import { DialogDescription } from "@radix-ui/react-dialog";
import { sportsOptions } from "../profile-components/SportsOptions";

interface EventModifyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseEvent?: EventWithRsvp;
  updateDisplayedEvent?: Dispatch<SetStateAction<EventWithRsvp>>;
}

const EventModify = ({
  open,
  onOpenChange,
  baseEvent,
  updateDisplayedEvent,
}: EventModifyProps) => {
  const [description, setDescription] = useState(
    baseEvent ? baseEvent.description : ""
  );
  const [sport, setSport] = useState(
    baseEvent ? baseEvent.sport.toUpperCase() : ""
  );
  const [eventImage, setEventImage] = useState(
    baseEvent ? baseEvent.eventImage : ""
  );
  const [eventTime, setEventTime] = useState(
    baseEvent ? getTimeOfDay(baseEvent.eventTime) : "12:00"
  );
  const [eventLocation, setEventLocation] = useState(
    baseEvent ? baseEvent.location : ""
  );
  const [date, setDate] = useState<Date | undefined>(
    baseEvent ? new Date(baseEvent.eventTime) : new Date()
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
    if (!baseEvent) {
      type CreateEvent = Omit<Event, "id" | "rsvps">;
      const event: CreateEvent = eventChanges;
      createEvent(event);
    } else {
      const event: EventWithRsvp = { ...baseEvent, ...eventChanges };
      editEvent(event);
      updateDisplayedEvent && updateDisplayedEvent(event);
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
          <div className="overflow-auto h-150">
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
            <MapsInput
              location={eventLocation}
              setLocation={(location) => {
                setEventLocation(location);
              }}
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
          </div>
          <Button className="w-1/1 mx-0 my-1" type="submit">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModify;
