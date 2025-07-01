import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface DropdownProps {
  setEditing: (enabled: boolean) => void;
}

const Dropdown = ({ setEditing }: DropdownProps) => {
  return (
    <div className="absolute top-3 right-10">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="text-3xl">...</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              Edit Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dropdown;
