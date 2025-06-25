import EventSearchFilter from "../components/events-components/EventSearchFilter";
import EventList from "../components/events-components/EventList";

const Events = () => {
  return (
    <section className="grow w-screen">
      <EventSearchFilter />
      <EventList />
    </section>
  );
};

export default Events;
