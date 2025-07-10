import { createContext, useContext, useState, type ReactNode } from "react";
import type { DisplayEvent } from "@/utils/interfaces";
import { getAllEvents } from "@/utils/eventService";
import type { EventFilters } from "@/utils/interfaces";

interface EventContextType {
  onMount: () => void;
  fetchEvents: (filters: EventFilters) => void;
  events: DisplayEvent[];
  isEventListLoading: boolean;
  areEventsEditable: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [isEventListLoading, setIsEventListLoading] = useState(true);
  const [areEventsEditable, setAreEventsEditable] = useState(false);

  const fetchEvents = async (filters: EventFilters) => {
    setIsEventListLoading(true);
    const retrievedEvents = await getAllEvents(filters);
    setEvents(retrievedEvents);
    setAreEventsEditable(filters.filter === "created");
    setIsEventListLoading(false);
  };

  const onMount = async () => {
    const retrievedEvents = await getAllEvents({ filter: "all" });
    setEvents(retrievedEvents);
    setIsEventListLoading(false);
  };

  return (
    <EventContext.Provider
      value={{
        onMount,
        fetchEvents,
        events,
        isEventListLoading,
        areEventsEditable,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("Modal Context Provider Failed");
  }
  return context;
};

export { EventProvider, useEventContext };
