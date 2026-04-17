import { createTheme } from "@mui/material/styles";

export const colors = {
  background: 'linear-gradient(135deg, rgba(15, 12, 41, 0.8), rgba(48, 43, 99, 0.8), rgba(36, 36, 62, 0.8))',
  primaryButton: '#00ffcc',
  secondaryButton: '#ff00ff',
  textLight: '#ffffff',
  textDark: '#333333',
  inputBackground: '#1a1a2e',
  inputText: '#00ffcc'
};

export const fontFamily = "'Orbitron', sans-serif";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryButton,
    },
    secondary: {
      main: colors.secondaryButton,
    },
    background: {
      default: colors.background,
    },
    text: {
      primary: colors.textLight,
      secondary: colors.textDark,
    },
  },
  typography: {
    fontFamily: fontFamily,
  },
});

export default theme;
