import { createTheme } from '@mui/material/styles';

// assets
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './comp-style-override';
import ThemePalette from './palette';
import ThemeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = () => {
  const color = colors;

  const themeOption = {
    colors: color,
    heading: color.darkLevel1,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.primary800,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.secondaryDark,
    menuSelectedBack: color.grey600,
    menuSelectedHover: color.paper,
    divider: color.grey200
  };

  const themeOptions = {
    spacing: (factor) => `${0.25 * factor}rem`,
    // 15px - 3.752 units
    // 400px - 5 units
    // 28px - 7 units
    //30px- 8 units
    // 35px - 8.752 units
    // 40px - 10 units
    // 52px - 13 units
    // breakpoints: {
    //   values: {
    //     xs: 0,
    //     sm: 576,
    //     md: 768,
    //     lg: 992,
    //     xl: 1200,
    //     xxl:1400
    //   },
    // },
    shadows: [
      'none',
      '0px 1px 18px 1px #BFD5EB',
      'inset 0px 1px 18px 1px #BFD5EB',
      '0px 1px 18px 1px rgba(0, 0, 0, 0.3)',
      '10px 15px 60px rgba(0, 0, 0, 0.25)',
      '0px 3px 6px 1px #BFD5EB;',
      '0px 13px 11px 1px #c0c3cb',
      '0px 15px 19px 0px #eeeeee',
      ...Array(17).fill('0px 1px 18px 1px #BFD5EB')
    ],
    direction: 'ltr',
    palette: ThemePalette(themeOption),
    typography: ThemeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
