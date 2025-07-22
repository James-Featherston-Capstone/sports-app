import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFilters } from "@/utils/interfaces";
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { useDialogContext } from "@/contexts/globalDialogContext";
import CustomEventFilters from "./CustomEventFilters";
import { useEventContext } from "@/contexts/eventContext";
import { Input } from "../ui/input";

const Filter = () => {
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    filter: "all",
  });
  const [query, setQuery] = useState<string>("");
  const { fetchEvents } = useEventContext();
  const { openDialog } = useDialogContext();

  const onFilterChange = (value: string) => {
    handleFilter({ filter: value });
  };

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const change: EventFilters = { filter: "search", query: query };
    handleFilter(change);
  };

  const handleFilter = (filtersChange: EventFilters) => {
    const newSearchFilters = { ...eventFilters, ...filtersChange };
    setEventFilters(newSearchFilters);
    fetchEvents(newSearchFilters);
  };

  const clearFilters = () => {
    setEventFilters({ filter: "all" });
    fetchEvents({ filter: "all" });
  };

  const openCustomFilters = () => {
    openDialog({
      title: "Filters",
      description: "Choose your custom filters...",
      reactChildren: (
        <CustomEventFilters
          handleFilter={handleFilter}
          baseFilters={eventFilters}
        />
      ),
    });
  };

  return (
    <article className="m-1 flex order-2 flex-wrap justify-center">
      <Select value={eventFilters.filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-37 m-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Nearby Events</SelectItem>
          <SelectItem value="search">Search</SelectItem>
          <SelectItem value="rsvp">My RSVP's</SelectItem>
          <SelectItem value="created">My Created</SelectItem>
        </SelectContent>
      </Select>
      {eventFilters.filter === "all" && (
        <>
          <Button
            variant="secondary"
            className="mx-3 m-1"
            onClick={openCustomFilters}
          >
            Custom Filters
          </Button>
          <Button variant="secondary" onClick={clearFilters} className="m-1">
            Clear Filters
          </Button>
        </>
      )}
      {eventFilters.filter === "search" && (
        <>
          <h1 className="w-1/1 mt-2 mb-1">
            Search by organizer or description
          </h1>
          <form onSubmit={onSearch} className="w-9/10 flex m-1">
            <Input
              className="bg-white text-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
            <Button type="submit">Search</Button>
          </form>
        </>
      )}
    </article>
  );
};

export default Filter;
