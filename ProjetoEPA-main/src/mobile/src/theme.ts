import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#00920C',
  primaryLight: '#00DC30',
  background: '#EDFEE8',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  error: '#DC2626',
  success: '#00920C',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.primaryLight,
    background: colors.background,
    surface: colors.white,
    error: colors.error,
  },
};
