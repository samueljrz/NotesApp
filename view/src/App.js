import React from 'react';
import './App.css';

import Routes from './routes';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#9c786c',
			main: '#6d4c41',
			dark: '#40241a',
			contrastText: '#fff'
		}
	}
});


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  );
}

export default App;