import Search from "./Search";
import Filter from "./Filter";
import { Button } from "../ui/button";

const SearchFilter = () => {
  return (
    <section className="flex flex-row items-start justify-center ml-1 mr-1 sm:ml-10 sm:mr-10 flex-wrap">
      <Filter />
      <Search />
      <Button variant="secondary" className="order-4 m-3">
        Create Event
      </Button>
    </section>
  );
};

export default SearchFilter;
