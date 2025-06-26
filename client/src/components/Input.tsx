import { Input } from "./ui/input";

type InputProps = {
  value: string;
  setValue: (value: string) => void;
  type: string;
};

const InputCustom = ({ value, setValue, type }: InputProps) => {
  return (
    <>
      <Input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default InputCustom;
