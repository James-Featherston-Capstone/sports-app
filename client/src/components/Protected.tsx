import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../contexts/loginContext";

const withAuth = (WrappedComponent: React.FC) => {
  const ProtectedComponent = (props: object) => {
    const { loginStatus } = useLoginContext();
    const navigate = useNavigate();
    useEffect(() => {
      if (!loginStatus) {
        navigate("/login");
      }
    }, [loginStatus]);
    if (!loginStatus) {
      return <></>; // Prevents flickering before redirection
    }

    return <WrappedComponent {...props} />;
  };
  return ProtectedComponent;
};

export default withAuth;
