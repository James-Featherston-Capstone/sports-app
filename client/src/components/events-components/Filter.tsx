import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filter = () => {
  return (
    <article className="m-3 flex">
      <Select>
        <SelectTrigger className="w-35">
          <SelectValue placeholder="Choose Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
        </SelectContent>
      </Select>
    </article>
  );
};

export default Filter;
