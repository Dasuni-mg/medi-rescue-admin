/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function ThemePalette(theme) {
  return {
    // mode: theme?.customization?.navType,
    common: {
      black: theme.colors?.darkPaper
    },
    primary: {
      light50: theme.colors?.primary800,
      light: theme.colors?.primaryLight,
      main: theme.colors?.primaryMain,
      dark: theme.colors?.primaryDark,
      200: theme.colors?.primary200,
      800: theme.colors?.primary800
    },
    secondary: {
      light: theme.colors?.secondaryLight,
      main: theme.colors?.secondaryMain,
      dark: theme.colors?.secondaryDark,
      200: theme.colors?.secondary200,
      800: theme.colors?.secondary800
    },
    error: {
      error50: theme.colors?.error50,
      error100: theme.colors?.error100,
      light: theme.colors?.errorLight,
      main: theme.colors?.errorMain,
      dark: theme.colors?.errorDark
    },
    orange: {
      light: theme.colors?.orangeLight,
      main: theme.colors?.orangeMain,
      dark: theme.colors?.orangeDark
    },
    warning: {
      light: theme.colors?.warningLight,
      main: theme.colors?.warningMain,
      dark: theme.colors?.warningDark
    },
    success: {
      text: theme.colors?.successText,
      light: theme.colors?.successLight,
      200: theme.colors?.success200,
      main: theme.colors?.successMain,
      dark: theme.cfolors?.successDark
    },
    grey: {
      50: theme.colors?.grey50,
      100: theme.colors?.grey100,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.darkTextPrimary,
      900: theme.textDark
    },
    dark: {
      light50: theme.colors?.grey200,
      light100: theme.colors?.grey500,
      light200: theme.colors?.grey300,
      light: theme.colors?.darkTextPrimary,
      main: theme.colors?.darkLevel1,
      dark: theme.colors?.darkLevel2,
      800: theme.colors?.darkBackground,
      900: theme.colors?.darkPaper
    },
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
      dark: theme.textDark,
      hint: theme.colors?.grey100
    },
    background: {
      paper: theme.paper,
      default: theme.backgroundDefault
    }
  };
}
