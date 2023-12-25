import { ReactElement } from 'react'

import { ThemeOptions, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ea580c',
    },
    secondary: {
      main: '#ea580c',
    },
  },
};

const theme =  createTheme(themeOptions)

type Props = {children: ReactElement | null}

function ThemeContext({children}: Props) {
  return (
     <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
}

export default ThemeContext