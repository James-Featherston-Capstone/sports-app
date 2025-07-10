import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFilters } from "@/utils/interfaces";
import { useState } from "react";
import { Button } from "../ui/button";

interface filterProps {
  handleFilter: (filter: EventFilters) => void;
}

const Filter = ({ handleFilter }: filterProps) => {
  const [selectedEventOption, setSelectedEventOption] = useState("all");

  const onFilterChange = (value: string) => {
    handleFilter({ filter: value });
    setSelectedEventOption(value);
  };

  return (
    <article className="m-3 flex order-2">
      <Select value={selectedEventOption} onValueChange={onFilterChange}>
        <SelectTrigger className="w-35">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="rsvp">My RSVP's</SelectItem>
          <SelectItem value="created">My Created</SelectItem>
        </SelectContent>
      </Select>
    </article>
  );
};

export default Filter;
