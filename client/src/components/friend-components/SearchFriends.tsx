import { useFriendContext } from "@/contexts/friendContext";
import { useState, type FormEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SearchFriends = () => {
  const { searchFriends } = useFriendContext();
  const [query, setQuery] = useState<string>("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    searchFriends(query);
  };
  return (
    <form className="flex m-3" onSubmit={onSubmit}>
      <Input
        className="mx-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Friends..."
      />
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
};

export default SearchFriends;
