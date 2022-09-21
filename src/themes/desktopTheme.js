import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    summary: {
        fontSize: "4vw",
    },
    name:'desktop',
    palette: {
        primary: {
            main: '#1BA39C',
    },
        secondary: {
            main: '#19857b',
    },
        error: {
            main: red.A400,
    }
  },
});

export default theme;
