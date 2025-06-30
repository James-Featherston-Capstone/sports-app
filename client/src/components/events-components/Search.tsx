import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Search = () => {
  const [query, setQuery] = useState("");
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };
  return (
    <article className="flex m-3 flex-grow-1 sm:flex-grow-0 order-1 sm:order-3">
      <form onSubmit={handleSearch} className="flex flex-grow-1">
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
