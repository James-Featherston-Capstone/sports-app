// Need to define an interface for an event
const EventCard = (event: Object) => {
  console.log(event);
  return (
    <article className="flex flex-col justify-start itmes-center w-75 h-100 m-3 p-1.5 border rounded-xl">
      <div>Is this working</div>
    </article>
  );
};

export default EventCard;
