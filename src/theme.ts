import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: red[600],
    },
    secondary: {
      main: "#4025af",
    },
    text: {
      secondary: "#8a8a8a",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontSize: "45px",
      fontWeight: 800,
    },
    h2: {
      fontSize: "40px",
      fontWeight: 600,
    },
    h5: {
      fontWeight: 800,
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
