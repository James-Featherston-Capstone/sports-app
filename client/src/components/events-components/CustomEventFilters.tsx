import type { EventFilters } from "@/utils/interfaces";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { useState, type FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { sportsOptions } from "../profile-components/SportsOptions";
import MapsInput from "../MapsInput";
import { useDialogContext } from "@/contexts/globalDialogContext";
interface AllEventFiltersProps {
  handleFilter: (filter: EventFilters) => void;
  baseFilters: EventFilters;
}
const CustomEventFilters = ({
  handleFilter,
  baseFilters,
}: AllEventFiltersProps) => {
  const { closeDialog } = useDialogContext();
  const [date, setDate] = useState<Date | undefined>(
    baseFilters.date ? new Date(baseFilters.date) : undefined
  );
  const [sport, setSport] = useState<string>(
    baseFilters.sport ? baseFilters.sport : ""
  );
  const [location, setLocation] = useState<string>(
    baseFilters.location ? baseFilters.location : ""
  );

  const onConfirmation = (e: FormEvent) => {
    e.preventDefault();
    const filters: EventFilters = {
      filter: "all",
      sport: sport,
      location: location,
      date: date?.toISOString(),
    };
    handleFilter(filters);
    closeDialog();
  };
  return (
    <form
      className="w-9/10 overflow-auto flex flex-col items-center"
      onSubmit={onConfirmation}
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border bg-white"
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
      />
      <Select value={sport} onValueChange={setSport}>
        <SelectTrigger className="w-1/1 my-0.5">
          <SelectValue placeholder="Choose Sport" />
        </SelectTrigger>
        <SelectContent>
          {sportsOptions.map((sport) => {
            return (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <MapsInput location={location} setLocation={setLocation} />
      <Button type="submit" className="w-1/1">
        Submit
      </Button>
    </form>
  );
};

export default CustomEventFilters;
