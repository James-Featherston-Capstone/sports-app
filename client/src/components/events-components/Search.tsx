import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Search = () => {
  const [query, setQuery] = useState("");
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };
  return (
    <article className="flex m-3">
      <form onSubmit={handleSearch} className="flex">
        <Input
          className="w-50 mr-1.5"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Events..."
          autoComplete="on"
        />
        <Button type="submit">Search</Button>
      </form>
    </article>
  );
};

export default Search;
