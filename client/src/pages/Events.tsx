import Filter from "@/components/events-components/Filter";
import EventList from "../components/events-components/EventList";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import EventModify from "@/components/events-components/EventModify";
import { useDialogContext } from "@/contexts/globalDialogContext";
import { useEventContext } from "@/contexts/eventContext";
import LoadingCircleSpinner from "@/components/Spinner";

const Events = () => {
  const { openDialog } = useDialogContext();
  const { onMount, isEventListLoading, addEvent } = useEventContext();

  useEffect(() => {
    onMount();
  }, []);

  const openEventCreationModal = () => {
    openDialog({
      title: "Create an Event",
      description: "Fill out the form to create an event",
      reactChildren: <EventModify addEvent={addEvent} />,
    });
  };

  return (
    <section className="w-screen grow-1 overflow-auto">
      <div className="flex justify-center flex-wrap">
        <Button
          variant="outline"
          className="order-0 sm:order-4 w-8/10 sm:w-auto mt-4 mb-1 border-black"
          onClick={() => openEventCreationModal()}
        >
          Create Event
        </Button>
        <Filter />
      </div>
      {isEventListLoading ? <LoadingCircleSpinner /> : <EventList />}
    </section>
  );
};

export default Events;
