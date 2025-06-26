import { useState } from "react";
import { Button } from "../ui/button";
import InputCustom from "../Input";

const Search = () => {
  const [query, setQuery] = useState("");
  const handleSearch = () => {};
  return (
    <article className="flex m-3">
      <div className="w-50 mr-1.5">
        <InputCustom value={query} setValue={setQuery} type="text" />
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </article>
  );
};

export default Search;
