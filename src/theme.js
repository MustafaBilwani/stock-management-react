// theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light', // Default mode
  useSystemColorMode: false, // Avoid switching based on system settings
};

const theme = extendTheme({ config });

export default theme;