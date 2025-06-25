import pfp from "../../assets/person.png";

const AthleteCard = () => {
  return (
    <article className="flex flex-col items-center justify-center w-75 h-100 rounded-2xl m-3 p-1.5 border">
      <img className="rounded-full p-3" src={pfp} alt="" />
      <h1>Name</h1>
      <p className="grow">Desciption</p>
      <div className="flex flex-row items-center justify-center">
        <h3 className="m-1">Location</h3>
        <h3 className="m-1">Sports</h3>
      </div>
    </article>
  );
};

export default AthleteCard;
