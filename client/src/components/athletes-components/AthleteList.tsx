import AthleteCard from "./AthleteCard";

const AthleteList = () => {
  const athletes = [{}, {}];

  return (
    <section className="flex justify-start">
      {athletes.map((athlete) => {
        return <AthleteCard athlete={athlete} />;
      })}
    </section>
  );
};

export default AthleteList;
