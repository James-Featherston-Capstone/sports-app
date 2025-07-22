import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { logout } from "@/utils/authService";

interface DropdownProps {
  setEditing: (enabled: boolean) => void;
}

const Dropdown = ({ setEditing }: DropdownProps) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const profile = await logout();
    if (profile) {
      navigate("/login");
    }
  };
  return (
    <div className="absolute top-3 right-10">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="text-3xl hover:cursor-pointer">...</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleLogout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dropdown;
