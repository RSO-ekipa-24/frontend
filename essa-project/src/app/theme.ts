// src/theme.ts
import {definePreset} from '@primeng/themes';
import Aura from '@primeng/themes/aura'

export const MyCustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Primary color for active states (like the blue highlight in the image)
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    colorScheme: {
      light: {
        surface: {
          50: '#f5f6fa'
        },
        text: {
          secondaryColor: '#979797' // Grey text for secondary elements (like "Admin" in the image)
        }
      }
    }
  }
});
