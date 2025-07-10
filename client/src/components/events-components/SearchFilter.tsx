import Search from "./Search";
import Filter from "./Filter";
import type { EventFilters } from "@/utils/interfaces";
import { useState } from "react";
import { useEventContext } from "@/contexts/eventContext";

const SearchFilter = () => {
  const { fetchEvents } = useEventContext();
  const [searchFilters, setSearchFilters] = useState<EventFilters>({
    filter: "all",
  });

  const onSearchFilterChange = (filtersChange: EventFilters) => {
    const newSearchFilters = { ...searchFilters, ...filtersChange };
    setSearchFilters(newSearchFilters);
    fetchEvents(newSearchFilters);
  };
  return (
    <section className="flex flex-row items-start justify-center ml-1 mr-1 sm:ml-10 sm:mr-10 flex-wrap">
      <Filter handleFilter={onSearchFilterChange} />
      {searchFilters.filter === "all" && (
        <Search handleSearch={onSearchFilterChange} />
      )}
    </section>
  );
};

export default SearchFilter;
