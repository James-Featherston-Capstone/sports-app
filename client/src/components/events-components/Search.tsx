import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Search = () => {
  const [query, setQuery] = useState("");
  const handleSearch = () => {};
  return (
    <article className="flex m-3">
      <div className="w-50 mr-1.5">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Events..."
        />
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </article>
  );
};

export default Search;
