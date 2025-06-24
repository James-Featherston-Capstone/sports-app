import EventCard from "./EventCard";

const EventList = () => {
  const events = [{}, {}];
  return (
    <section className="flex justify-start">
      {events.map((event) => {
        return <EventCard event={event} />;
      })}
    </section>
  );
};

export default EventList;
