import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
  dateType: string;
  referenceDate: Date | undefined;
}

const DatePicker = ({
  date,
  setDate,
  dateType,
  referenceDate,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="bg-transparent w-1/1">
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {dateType === "start" && (
          <Calendar
            required
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border bg-white"
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
              (referenceDate != undefined &&
                date >
                  new Date(new Date(referenceDate).setHours(23, 59, 59, 59)))
            }
          />
        )}
        {dateType === "end" && (
          <Calendar
            required
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border bg-white"
            disabled={(date) =>
              date <
              (referenceDate
                ? new Date(new Date(referenceDate).setHours(0, 0, 0, 0))
                : new Date(new Date().setHours(0, 0, 0, 0)))
            }
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
