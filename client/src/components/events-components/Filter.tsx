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
import { useDialogContext } from "@/contexts/globalDialogContext";
import CustomEventFilters from "./CustomEventFilters";
import { useEventContext } from "@/contexts/eventContext";

const Filter = () => {
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    filter: "all",
  });
  const { fetchEvents } = useEventContext();
  const { openDialog } = useDialogContext();

  const onFilterChange = (value: string) => {
    handleFilter({ filter: value });
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
        <SelectTrigger className="w-36 mt-3 border-black mx-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Nearby Events</SelectItem>
          <SelectItem value="rsvp">My RSVP's</SelectItem>
          <SelectItem value="created">My Created</SelectItem>
        </SelectContent>
      </Select>
      {eventFilters.filter === "all" && (
        <div className="mt-2">
          <Button
            variant="outline"
            className="mx-3 m-1 border-black"
            onClick={openCustomFilters}
          >
            Custom Filters
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="m-1 border-black"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </article>
  );
};

export default Filter;
