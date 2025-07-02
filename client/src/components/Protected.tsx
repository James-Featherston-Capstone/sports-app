import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../contexts/loginContext";
import { checkStatus } from "@/utils/authService";

interface WithAuthVars {
  WrappedComponent: React.FC;
  canRedirect: boolean;
}

const withAuth = ({ WrappedComponent, canRedirect }: WithAuthVars) => {
  const ProtectedComponent = (props: object) => {
    const { loginStatus, setLoginStatus } = useLoginContext();
    const navigate = useNavigate();
    useEffect(() => {
      if (!loginStatus) {
        if (checkStatus()) {
          setLoginStatus(true);
        } else {
          if (canRedirect) {
            navigate("/login");
          }
        }
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
