import React from 'react';
import './App.css';

import Routes from './routes';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#33c9dc',
			main: '#FF5722',
			dark: '#d50000',
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