
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </NextThemesProvider>
  );
}
