// Paleta validada (ver skill dataviz — passou nos 6 checks de contraste/CVD).
// light/dark trocam juntos conforme o tema do sistema (usePrefersDark).

export const CATEGORICAL = {
  light: ['#2a78d6', '#008300', '#e87ba4', '#eda100', '#1baf7a', '#eb6834', '#4a3aa7', '#e34948'],
  dark: ['#3987e5', '#008300', '#d55181', '#c98500', '#199e70', '#d95926', '#9085e9', '#e66767'],
}

export const STATUS = {
  light: { good: '#0ca30c', warning: '#fab219', serious: '#ec835a', critical: '#d03b3b' },
  dark: { good: '#0ca30c', warning: '#fab219', serious: '#ec835a', critical: '#d03b3b' },
}

export const CHROME = {
  light: {
    surface: '#fcfcfb',
    gridline: '#e1e0d9',
    axis: '#c3c2b7',
    textMuted: '#898781',
    textSecondary: '#52514e',
    textPrimary: '#0b0b0b',
  },
  dark: {
    surface: '#1a1a19',
    gridline: '#2c2c2a',
    axis: '#383835',
    textMuted: '#898781',
    textSecondary: '#c3c2b7',
    textPrimary: '#ffffff',
  },
}

export function categoryColor(index, isDark) {
  const palette = isDark ? CATEGORICAL.dark : CATEGORICAL.light
  return palette[index % palette.length]
}
