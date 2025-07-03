import Search from "./Search";
import Filter from "./Filter";
import type { EventFilters } from "@/utils/interfaces";
import { useState } from "react";

interface SearchFilterProps {
  handleSearchFilter: (filters: EventFilters) => void;
}

const SearchFilter = ({ handleSearchFilter }: SearchFilterProps) => {
  const [searchFilters, setSearchFilters] = useState<EventFilters>({
    filter: "all",
  });

  const onSearchFilterChange = (filtersChange: EventFilters) => {
    const newSearchFilters = { ...searchFilters, ...filtersChange };
    setSearchFilters(newSearchFilters);
    handleSearchFilter(newSearchFilters);
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
