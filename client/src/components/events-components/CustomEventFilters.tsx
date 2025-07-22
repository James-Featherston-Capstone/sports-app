import type { EventFilters } from "@/utils/interfaces";
import { Button } from "../ui/button";
import DatePicker from "../DatePicker";
import { Slider } from "../ui/slider";
import { useState, type FormEvent } from "react";
import { Input } from "../ui/input";
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
  const [startDate, setStartDate] = useState<Date | undefined>(
    baseFilters.startDate ? new Date(baseFilters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    baseFilters.endDate ? new Date(baseFilters.endDate) : undefined
  );
  const [sport, setSport] = useState<string>(
    baseFilters.sport ? baseFilters.sport : ""
  );
  const [location, setLocation] = useState<string>(
    baseFilters.location ? baseFilters.location : ""
  );
  const [radius, setRadius] = useState<number[]>(
    baseFilters.radius ? baseFilters.radius : [10]
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    baseFilters.query ? baseFilters.query : ""
  );

  const onConfirmation = (e: FormEvent) => {
    e.preventDefault();
    const filters: EventFilters = {
      filter: "all",
      sport: sport,
      location: location,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      radius: radius,
      query: searchQuery,
    };
    handleFilter(filters);
    closeDialog();
  };
  return (
    <form
      className="w-9/10 overflow-auto flex flex-col items-center"
      onSubmit={onConfirmation}
    >
      <label className="text-sm mb-1">Select a date range</label>
      <div className="flex">
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          dateType="start"
          referenceDate={endDate}
        />
        <span className="h-8 flex justify-center items-center">-</span>
        <DatePicker
          date={endDate}
          setDate={setEndDate}
          dateType="end"
          referenceDate={startDate}
        />
      </div>
      <div className="flex w-1/1 py-1 m-1">
        <h1 className="text-xl mx-2 w-31">Radius: {radius}</h1>
        <Slider
          max={25}
          min={5}
          step={1}
          defaultValue={radius}
          value={radius}
          onValueChange={setRadius}
        />
      </div>
      <Select value={sport} onValueChange={setSport}>
        <SelectTrigger className="w-1/1 m-1">
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
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search... (description or organizer)"
      />
      <MapsInput location={location} setLocation={setLocation} showMap={true} />
      <Button type="submit" className="w-1/1">
        Submit
      </Button>
    </form>
  );
};

export default CustomEventFilters;
