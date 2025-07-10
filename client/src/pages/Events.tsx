import SearchFilter from "../components/events-components/SearchFilter";
import EventList from "../components/events-components/EventList";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import EventModify from "@/components/events-components/EventModify";
import { useDialogContext } from "@/contexts/globalDialogContext";
import { useEventContext } from "@/contexts/eventContext";

const Events = () => {
  const { openDialog } = useDialogContext();
  const { onMount, isEventListLoading } = useEventContext();

  useEffect(() => {
    onMount();
  }, []);

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
        <SearchFilter />
      </div>
      {isEventListLoading ? <h1>Loading...</h1> : <EventList />}
    </section>
  );
};

export default Events;
