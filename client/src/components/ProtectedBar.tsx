import { useLoginContext } from "../contexts/loginContext";

const withAuthBar = (WrappedComponent: React.FC) => {
  const ProtectedComponent = (props: object) => {
    const { loginStatus } = useLoginContext();
    if (!loginStatus) {
      return <></>; // Prevents flickering before redirection
    }

    return <WrappedComponent {...props} />;
  };
  return ProtectedComponent;
};

export default withAuthBar;
