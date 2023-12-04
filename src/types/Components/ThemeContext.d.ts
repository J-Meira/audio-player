import { ReactNode } from 'react';

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ThemeContextData {
  backgroundColor: string;
  dark: boolean;
  onChangeMode: () => void;
}
