import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './Components/App';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

// import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#019639'
    },
    secondary: {
      main: '#006225',
    },
    error: {
      main: '#d32f2f',
    },
    test: {
      main: '##f57c00',
    }
  },
});

ReactDOM.render(
  <SnackbarProvider autoHideDuration={3000}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
