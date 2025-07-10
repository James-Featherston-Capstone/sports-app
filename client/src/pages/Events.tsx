import SearchFilter from "../components/events-components/SearchFilter";
import EventList from "../components/events-components/EventList";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/utils/eventService";
import { useEffect, useState } from "react";
import type { EventWithRsvp } from "@/utils/interfaces";
import EventModify from "@/components/events-components/EventModify";
import type { EventFilters } from "@/utils/interfaces";
import { useDialogContext } from "@/contexts/globalDialogContext";

const Events = () => {
  const { openDialog } = useDialogContext();
  const [events, setEvents] = useState<EventWithRsvp[]>([]);
  const [isEventListLoading, setIsEventListLoading] = useState(true);
  const [areEventsEditable, setAreEventsEditable] = useState(false);

  const fetchEvents = async () => {
    const retrievedEvents = await getAllEvents();
    setEvents(retrievedEvents);
    setIsEventListLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchFilter = async (filters: EventFilters) => {
    setIsEventListLoading(true);
    const filteredEvents = await getAllEvents(filters);
    setEvents(filteredEvents);
    if (filters.filter === "created") {
      setAreEventsEditable(true);
    } else {
      setAreEventsEditable(false);
    }
    setIsEventListLoading(false);
  };

  const openEventCreationModal = () => {
    openDialog({
      title: "Create an Event",
      description: "Fill out the form to create an event",
      reactChildren: <EventModify />,
    });
  };

  return (
    <section className="w-1/1 grow-1 overflow-auto">
      <div className="flex justify-center flex-wrap">
        <Button
          variant="secondary"
          className="order-0 sm:order-4 w-8/10 sm:w-auto m-3"
          onClick={() => openEventCreationModal()}
        >
          Create Event
        </Button>
        <SearchFilter handleSearchFilter={handleSearchFilter} />
      </div>
      {isEventListLoading ? (
        <h1>Loading...</h1>
      ) : (
        <EventList events={events} areEventsEditable={areEventsEditable} />
      )}
    </section>
  );
};

export default Events;
