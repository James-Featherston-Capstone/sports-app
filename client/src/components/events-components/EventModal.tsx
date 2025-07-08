import type { EventWithAllData } from "@/utils/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { getEvent } from "@/utils/eventService";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number;
}
const EventModal = ({ open, onOpenChange, eventId }: EventModalProps) => {
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [event, setEvent] = useState<EventWithAllData | null>(null);
  useEffect(() => {
    const fetchEvent = async () => {
      const fetchedEvent = await getEvent(eventId);
      setEvent(fetchedEvent);
      setIsEventLoading(false);
    };
    fetchEvent();
  }, []);

  if (isEventLoading) {
    return <></>;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black flex flex-col items-center min-h-8/10 min-w-8/10">
        <DialogHeader>
          <DialogTitle>
            {event?.sport} at {event?.location}
          </DialogTitle>
          <DialogDescription>{event?.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto bg-amber-600">
          <div className="grow-0 md:grow-1">
            <img src={event?.eventImage} alt="" />
            <h4>{event?.description}</h4>
            <h3>Sport: {event?.sport}</h3>
            <div className="flex">
              <h3>Rsvps:</h3>
              {event?.rsvps.slice(0, 10).map((rsvp, index) => (
                <h3 className="mx-1" key={index}>
                  {rsvp.user.username},
                </h3>
              ))}
              ...
            </div>
          </div>
          <div className="grow-1">These are comments</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
