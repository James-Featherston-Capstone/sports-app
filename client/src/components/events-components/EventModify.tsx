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
import { getDateTime } from "../../utils/utils";
import { createEvent } from "@/utils/eventService";
import type { Event } from "@/utils/interfaces";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EventModifyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const EventModify = ({ open, onOpenChange }: EventModifyProps) => {
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventTime, setEventTime] = useState("12:00");
  const [eventLocation, setEventLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleEventModify = async (e: FormEvent) => {
    e.preventDefault();
    console.log(date);
    const event: Event = {
      description: description,
      sport: sport,
      eventImage: eventImage ? eventImage : "",
      eventTime: getDateTime(eventTime, date).toISOString(),
      location: eventLocation,
    };
    console.log("Here");
    createEvent(event);
    console.log(event);
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
