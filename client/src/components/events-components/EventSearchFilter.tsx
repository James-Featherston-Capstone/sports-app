import Search from "./Search";
import Filter from "./Filter";

const EventSearchFilter = () => {
  return (
    <section className="flex flex-row items-start justify-center ml-10 mr-10">
      <Filter />
      <Search />
    </section>
  );
};

export default EventSearchFilter;
