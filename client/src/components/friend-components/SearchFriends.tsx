import { useFriendContext } from "@/contexts/friendContext";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SearchFriends = () => {
  const { searchFriends } = useFriendContext();
  const [query, setQuery] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    searchFriends(newQuery);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    searchFriends(query);
  };
  return (
    <form onSubmit={onSubmit} className="flex m-3">
      <Input
        className="mx-1"
        value={query}
        onChange={onChange}
        placeholder="Search Friends..."
      />
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
};

export default SearchFriends;
