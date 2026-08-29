// Shared by every KMUTNB-branded screen (booking, booking-admin, login): the
// look borrowed from the DMS_c project's design system — KMUTNB's brick red
// (#AC3520) as the only accent, warm greys, hairline borders and soft shadows
// instead of the template's default blue and heavier card shadows. Applied as
// a nested theme so the rest of the (much larger) admin template is unaffected.
import { Theme, createTheme, lighten, darken } from "@mui/material";

const accent = "#AC3520";
const accentHover = "#8E2A19";
const accentSoft = "#FBEEEA";
const border = "#EAE6E3";
const borderStrong = "#D9D2CE";
const surface2 = "#F3F1EA";

// Status tones per style-guide.md — deliberately muted/warm so they read as
// a distinct hue family from the brick-red accent, never a tint of it.
const ok = "#146C43";
const okSoft = "#E7F4EC";
const warn = "#92620A";
const warnSoft = "#FCF3E3";
const danger = "#8A1C12";
const dangerSoft = "#FBE9E7";

const textPrimary = "#1C1917";
const textSecondary = "#5F5852";
const textDisabled = "#928982";

const shadowMd =
  "0 4px 14px -4px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.04)";
const shadowLg = "0 16px 40px -12px rgba(16, 24, 40, 0.18)";

export function createKmutnbTheme(baseTheme: Theme): Theme {
  return createTheme(baseTheme, {
    palette: {
      primary: {
        light: lighten(accent, 0.3),
        main: accent,
        dark: accentHover,
        contrastText: "#ffffff",
      },
      success: {
        light: lighten(ok, 0.3),
        main: ok,
        dark: darken(ok, 0.2),
        contrastText: "#ffffff",
      },
      warning: {
        light: lighten(warn, 0.3),
        main: warn,
        dark: darken(warn, 0.2),
        contrastText: "#ffffff",
      },
      error: {
        light: lighten(danger, 0.3),
        main: danger,
        dark: darken(danger, 0.2),
        contrastText: "#ffffff",
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
        disabled: textDisabled,
      },
      divider: border,
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
        lighter: accentSoft,
        light: lighten(accent, 0.3),
        main: accent,
        dark: accentHover,
      },
      success: {
        lighter: okSoft,
        light: lighten(ok, 0.3),
        main: ok,
        dark: darken(ok, 0.2),
      },
      warning: {
        lighter: warnSoft,
        light: lighten(warn, 0.3),
        main: warn,
        dark: darken(warn, 0.2),
      },
      error: {
        lighter: dangerSoft,
        light: lighten(danger, 0.3),
        main: danger,
        dark: darken(danger, 0.2),
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: `'IBM Plex Sans Thai', 'Noto Sans Thai', ${baseTheme.typography.fontFamily}`,
      h1: { fontWeight: 600, letterSpacing: "-0.01em" },
      h2: { fontWeight: 600, letterSpacing: "-0.01em" },
      h3: { fontWeight: 600, letterSpacing: "-0.01em" },
      h4: { fontWeight: 600, letterSpacing: "-0.01em" },
      h5: { fontWeight: 600, letterSpacing: "-0.01em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      subtitle1: { color: textSecondary },
      subtitle2: { color: textSecondary },
      caption: { color: textDisabled },
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
          deleteIcon: {
            color: lighten(danger, 0.3),
            "&:hover": {
              color: danger,
            },
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
            borderRadius: 12,
          },
          standardSuccess: { borderLeft: `3px solid ${ok}` },
          standardWarning: { borderLeft: `3px solid ${warn}` },
          standardError: { borderLeft: `3px solid ${danger}` },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: borderStrong,
          },
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: darken(borderStrong, 0.15),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: accent,
              boxShadow: `0 0 0 4px ${accentSoft}`,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { boxShadow: shadowMd },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: { boxShadow: shadowMd },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { boxShadow: shadowLg },
        },
      },
    },
  });
}
