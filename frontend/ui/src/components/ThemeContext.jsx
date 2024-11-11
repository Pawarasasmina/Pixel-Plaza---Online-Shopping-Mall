// src/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // default theme

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeStyles = {
    light: {
      primary: "#E76F51",
      secondary: "#5C646C",
      light: "#F4F4F4",
      dark: "#212529",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#000000",
      baseextra2: "#E76F51",
      baseextra3: "#212529",
      baseextra4: "#02203c",
      baseextra5: "#171614",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};
