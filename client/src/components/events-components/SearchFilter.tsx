import Search from "./Search";
import Filter from "./Filter";

const SearchFilter = () => {
  return (
    <section className="flex flex-row items-start justify-center ml-1 mr-1 sm:ml-10 sm:mr-10 flex-wrap">
      <Filter />
      <Search />
    </section>
  );
};

export default SearchFilter;
