
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme={defaultTheme} attribute="class">
      {children}
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const [theme, setThemeState] = useState('light');
  
  // نسخة مؤقتة لاستخدامها في الواجهة حتى يتم تكامل next-themes بشكل صحيح
  const setTheme = (newTheme: string) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setThemeState(newTheme);
  };
  
  useEffect(() => {
    // تحميل السمة المحفوظة عند بدء التشغيل
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);
  
  return { theme, setTheme };
};
