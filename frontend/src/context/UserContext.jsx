import { createContext, useState } from "react";

export const UserContext = createContext({ isAuthorized: false });

export const AppWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [isVerified, setIsverified] = useState(false);

  return (
    <UserContext.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
        showLogin,
        setShowLogin,
        isVerified,
        setIsverified,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
