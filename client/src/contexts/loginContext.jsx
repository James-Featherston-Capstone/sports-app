import { createContext, useContext, useState } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginContext = () => {
  return useContext(LoginContext);
};

export { LoginProvider, useLoginContext };
