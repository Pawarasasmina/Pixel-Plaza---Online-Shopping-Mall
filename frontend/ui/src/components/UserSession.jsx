import React, { createContext, useContext, useEffect, useState } from "react";

// Create UserContext
const UserContext = createContext();

// UserSession Provider
export const UserSessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userLevel", user.userLevel);

      // Store shopId for sellers (userLevel === 1)
      if (user.userLevel === 1 && user.shopId) {
        localStorage.setItem("shopId", user.shopId);
      } else {
        localStorage.removeItem("shopId");
      }
    }
  }, [user]);

  // Function to clear user data from local storage
  const clearUserSession = () => {
    setUser(null); // Clear user state
    localStorage.removeItem("userId");

    localStorage.removeItem("shopId");
    localStorage.removeItem("userLevel");
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUserSession }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user session
export const useUserSession = () => {
  return useContext(UserContext);
};

export default UserContext;
