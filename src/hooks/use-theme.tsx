
import { useTheme as useThemeContext } from "@/providers/theme-provider";

export const useTheme = () => {
  const context = useThemeContext();
  const theme = context.theme === 'system' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : context.theme;
    
  return { 
    theme: theme as 'dark' | 'light',
    setTheme: context.setTheme
  };
};
