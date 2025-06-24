import SearchFilter from "../components/events-components/SearchFilter";
import EventList from "../components/events-components/EventList";

const Events = () => {
  return (
    <section className="w-1/1 grow-1">
      <SearchFilter />
      <EventList />
    </section>
  );
};

export default Events;
