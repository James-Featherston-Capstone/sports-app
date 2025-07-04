import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { EventFilters } from "@/utils/interfaces";

interface SearchProps {
  handleSearch: (query: EventFilters) => void;
}

const Search = ({ handleSearch }: SearchProps) => {
  const [query, setQuery] = useState("");
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch({ searchQuery: query });
  };
  return (
    <article className="flex m-3 flex-grow-1 sm:flex-grow-0 order-1 sm:order-3">
      <form onSubmit={onSearch} className="flex flex-grow-1">
        <Input
          className="w-90/100 flex-grow-1 sm:w-50 mr-1.5"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Events..."
          autoComplete="on"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
    </article>
  );
};

export default Search;
