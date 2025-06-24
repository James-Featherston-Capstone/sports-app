type InputProps = {
  value: string;
  setValue: (value: string) => void;
};

const Input = ({ value, setValue }: InputProps) => {
  return (
    <>
      <input
        type="text"
        className="w-100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default Input;
