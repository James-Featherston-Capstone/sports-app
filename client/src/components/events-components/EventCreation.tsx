import type { EventType } from "@/utils/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

interface EventCreationProp {
  event?: EventType;
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

const EventCreation = ({ event }: EventCreationProp) => {
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventTime, setEventTime] = useState("12:00");
  const [eventLocation, setEventLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect;
  const handleEventCreation = () => {
    console.log(event);
  };
  return (
    <div className="w-screen h-screen fixed bg-gray-500 top-0 flex items-center justify-center">
      <Card>
        <CardTitle>Create an Event</CardTitle>
        <CardContent>
          <form onSubmit={handleEventCreation}>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="on"
              placeholder="Event Description"
              required
            />
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger className="w-1/1">
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
              required
            />
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
              disabled={(date) => date < new Date()}
            />
            <Input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
            <Input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              autoComplete="on"
              placeholder="Set Location"
              required
            />
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreation;
