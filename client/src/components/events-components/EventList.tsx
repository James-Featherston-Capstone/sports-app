import EventCard from "./EventCard";

const EventList = () => {
  const events = [{ name: "john" }, { name: "Hernyr" }];
  return (
    <section className="flex justify-start">
      {events.map((event) => {
        return <EventCard event={event} />;
      })}
    </section>
  );
};

export default EventList;
