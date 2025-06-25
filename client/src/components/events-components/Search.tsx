import { useState } from "react";
import Input from "../Input";

const Search = () => {
  const [query, setQuery] = useState("");
  const handleSearch = () => {};
  return (
    <article className="flex m-3">
      <div className="w-50 mr-1.5">
        <Input value={query} setValue={setQuery} type="text" />
      </div>
      <button onClick={handleSearch}>Search</button>
    </article>
  );
};

export default Search;
