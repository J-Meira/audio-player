import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ThemeProvider as MuiThemeProvider,
  createTheme as muiCreateTheme,
} from '@mui/material/styles';
import { ThemeContextData, ThemeProviderProps } from '../../types';

const ThemeContext = createContext({} as ThemeContextData);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [dark, setDark] = useState(false);

  const backgroundColor = useMemo(
    () => (dark ? '#191919' : '#f0f0f7'),
    [dark],
  );

  const handleChangeMode = useCallback(() => {
    localStorage.setItem('THEME_MODE', JSON.stringify(!dark));
    setDark(!dark);
  }, [dark]);

  const createTheme = useCallback(
    () =>
      muiCreateTheme({
        palette: {
          mode: dark ? 'dark' : 'light',
          primary: {
            light: '#ff5f4e',
            main: '#ed1c24',
            dark: '#b20000',
            contrastText: '#fff',
          },
          secondary: {
            light: '#cdd0d9',
            main: '#9c9fa8',
            dark: '#6e7179',
            contrastText: '#000',
          },
        },
        components: {
          MuiAppBar: {
            defaultProps: {
              enableColorOnDark: true,
            },
          },
        },
      }),
    [dark],
  );

  useEffect(() => {
    if (!localStorage.getItem('THEME_MODE')) {
      const userTheme = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      localStorage.setItem('THEME_MODE', JSON.stringify(userTheme));
      setDark(userTheme);
    } else {
      const localDark = JSON.parse(
        localStorage.getItem('THEME_MODE') || 'false',
      );
      if (localDark) setDark(true);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        backgroundColor,
        dark,
        onChangeMode: handleChangeMode,
      }}
    >
      <MuiThemeProvider theme={createTheme()}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
