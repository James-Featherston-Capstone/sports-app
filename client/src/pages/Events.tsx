import SearchFilter from "../components/events-components/SearchFilter";
import EventList from "../components/events-components/EventList";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/utils/eventService";
import { useEffect, useState } from "react";
import type { EventWithRsvp } from "@/utils/interfaces";
import EventModify from "@/components/events-components/EventModify";
import type { EventFilters } from "@/utils/interfaces";

const Events = () => {
  const [events, setEvents] = useState<EventWithRsvp[]>([]);
  const [isEventListLoading, setIsEventListLoading] = useState(true);
  const [isShowingCreationForm, setIsShowingCreationForm] = useState(false);
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

  return (
    <section className="w-1/1 grow-1 overflow-auto">
      <div className="flex justify-center flex-wrap">
        <Button
          variant="secondary"
          className="order-0 sm:order-4 w-8/10 sm:w-auto m-3"
          onClick={() => setIsShowingCreationForm(true)}
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
      {isShowingCreationForm && (
        <EventModify
          open={isShowingCreationForm}
          onOpenChange={setIsShowingCreationForm}
          isCreatingEvent={true}
          baseEvent={{} as Event}
          updateDisplayedEvent={(_: Event): void => {}}
        />
      )}
    </section>
  );
};

export default Events;
