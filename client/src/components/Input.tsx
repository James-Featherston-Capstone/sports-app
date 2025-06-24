type InputProps = {
  value: string;
  setValue: (value: string) => void;
  type: string;
};

const Input = ({ value, setValue, type }: InputProps) => {
  return (
    <>
      <input
        type={type}
        className="w-1/1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default Input;
