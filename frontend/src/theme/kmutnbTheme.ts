// Shared by every KMUTNB-branded screen (booking, booking-admin, login): the
// look borrowed from the DMS_c project's design system — KMUTNB's brick red
// (#AC3520) as the only accent, warm greys, hairline borders and soft shadows
// instead of the template's default blue and heavier card shadows. Applied as
// a nested theme so the rest of the (much larger) admin template is unaffected.
import { Theme, createTheme, lighten } from "@mui/material";

const accent = "#AC3520";
const accentHover = "#8E2A19";
const border = "#EAE6E3";
const surface2 = "#F3F1EA";

export function createKmutnbTheme(baseTheme: Theme): Theme {
  return createTheme(baseTheme, {
    palette: {
      primary: {
        light: lighten(accent, 0.3),
        main: accent,
        dark: accentHover,
        contrastText: "#ffffff",
      },
      background: {
        default: "#F8F7F6",
        paper: "#ffffff",
      },
    },
    // The Header/Sidebar chrome (outside this theme's usual reach — see
    // ExtendedSidebarLayout) reads brand colour from this legacy `colors`
    // bag rather than `palette`, so it has to be kept in step separately.
    colors: {
      primary: {
        lighter: `${accent}1a`,
        light: lighten(accent, 0.3),
        main: accent,
        dark: accentHover,
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: `'IBM Plex Sans Thai', 'Noto Sans Thai', ${baseTheme.typography.fontFamily}`,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${border}`,
            boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          outlined: {
            borderColor: border,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            background: surface2,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td": { borderBottom: 0 },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: accent,
            border: `1px solid ${accentHover}`,
            boxShadow: `0px 2px 10px ${lighten(accent, 0.5)}`,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });
}
