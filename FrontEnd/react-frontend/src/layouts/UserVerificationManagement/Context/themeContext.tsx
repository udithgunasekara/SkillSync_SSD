import { createContext } from "react";

type ThemeType = {
      theme: string;
      setTheme: React.Dispatch<React.SetStateAction<string>>
}


export const ThemeContext = createContext<ThemeType|undefined>(undefined);