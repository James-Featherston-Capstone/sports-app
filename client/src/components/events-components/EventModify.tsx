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
import { getDateTime, getTimeOfDay } from "../../utils/utils";
import { createEvent, editEvent } from "@/utils/eventService";
import type { DisplayEvent, EventModel } from "@/utils/interfaces";
import { sportsOptions } from "../profile-components/SportsOptions";
import { useDialogContext } from "@/contexts/globalDialogContext";

interface EventModifyProps {
  baseEvent?: DisplayEvent;
  updateDisplayedEvent?: Dispatch<SetStateAction<DisplayEvent>>;
  addEvent?: (event: DisplayEvent) => void;
}

const EventModify = ({
  baseEvent,
  updateDisplayedEvent,
  addEvent,
}: EventModifyProps) => {
  const { closeDialog } = useDialogContext();
  const [errorMessage, setErrorMessage] = useState<string>("");
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
    if (description === "") {
      setErrorMessage("Description Required");
    } else if (sport === "") {
      setErrorMessage("Sport Required");
    } else if (eventLocation === "") {
      setErrorMessage("Location required");
    } else {
      if (!baseEvent) {
        type CreateEvent = Omit<EventModel, "id" | "rsvps">;
        const event: CreateEvent = eventChanges;
        const createdEvent = await createEvent(event);
        if (addEvent) addEvent(createdEvent);
      } else {
        const event: DisplayEvent = { ...baseEvent, ...eventChanges };
        editEvent(event);
        updateDisplayedEvent && updateDisplayedEvent(event);
      }
      closeDialog();
    }
  };
  return (
    <form className="w-9/10" onSubmit={handleEventModify}>
      <div className="overflow-auto h-150 flex flex-col items-center">
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
          setLocation={(location) => {
            setEventLocation(location);
          }}
          baseLatitude={
            baseEvent?.latitude ? parseFloat(baseEvent.latitude) : 0
          }
          baseLongitude={
            baseEvent?.longitude ? parseFloat(baseEvent.longitude) : 0
          }
          showMap={true}
        />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border bg-white"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
        <Input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="my-1"
        />
        <h1 className="text-red-500 text-lg">{errorMessage}</h1>
      </div>
      <Button className="w-1/1 mx-0 my-1" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default EventModify;
