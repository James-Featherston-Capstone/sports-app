import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LoginContextType {
  loginStatus: boolean;
  setLoginStatus: (status: boolean) => void;
}

const LoginContext = createContext<LoginContextType>({
  loginStatus: false,
  setLoginStatus: () => {},
});

const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [loginStatus, setLoginStatus] = useState(false);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("What is happening");
  }
  return context;
};

export { LoginProvider, useLoginContext };
