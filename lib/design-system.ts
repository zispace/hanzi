// Design System - Chinese Aesthetic with 60-30-10 Rule
// 60% Primary: Warm off-white backgrounds (paper-like)
// 30% Secondary: Soft grays and muted tones (ink wash)
// 10% Accent: Deep crimson red (traditional Chinese red)

export const colors = {
  // Primary (60%) - Paper-like backgrounds
  primary: {
    50: '#FEFEFE',  // Pure white
    100: '#FAF9F6', // Warm white
    200: '#F5F2ED', // Soft cream
    300: '#F0ECE4', // Light paper
    400: '#E8E2D5', // Muted paper
    500: '#DFD6C4', // Paper base
  },
  
  // Secondary (30%) - Ink wash tones
  secondary: {
    50: '#9A9A9A',  // Light gray
    100: '#7A7A7A', // Medium gray
    200: '#5A5A5A', // Dark gray
    300: '#3A3A3A', // Charcoal
    400: '#2A2A2A', // Deep charcoal
    500: '#1A1A1A', // Near black
  },
  
  // Accent (10%) - Traditional Chinese red
  accent: {
    50: '#FFE5E5', // Light red tint
    100: '#FFCCCC', // Soft red
    200: '#FF9999', // Medium red
    300: '#DC143C', // Crimson
    400: '#B91C1C', // Deep crimson
    500: '#991B1B', // Dark crimson
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Text colors
  text: {
    primary: '#1A1A1A',
    secondary: '#5A5A5A',
    tertiary: '#9A9A9A',
    inverse: '#FEFEFE'
  }
}

export const typography = {
  // Chinese font stack
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans SC', 'Microsoft YaHei', 'sans-serif'],
    serif: ['Georgia', 'Times New Roman', 'Songti SC', 'SimSun', 'serif'],
    kai: ['KaiTi', 'STKaiti', 'KaiTi_GB2312', 'serif'], // 楷体
    song: ['SimSun', 'Songti SC', 'serif'], // 宋体
    hei: ['SimHei', 'Heiti SC', 'sans-serif'] // 黑体
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  }
}

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

export const shadows = {
  subtle: '0 1px 3px rgba(26, 26, 26, 0.12), 0 1px 2px rgba(26, 26, 26, 0.24)',
  soft: '0 4px 6px rgba(26, 26, 26, 0.07), 0 2px 4px rgba(26, 26, 26, 0.06)',
  medium: '0 10px 25px rgba(26, 26, 26, 0.1), 0 6px 10px rgba(26, 26, 26, 0.08)',
  strong: '0 20px 40px rgba(26, 26, 26, 0.15), 0 10px 20px rgba(26, 26, 26, 0.12)',
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
}

// Utility classes for consistent styling
export const utils = {
  // Background colors
  bgPrimary: (shade: keyof typeof colors.primary) => `bg-[${colors.primary[shade]}]`,
  bgSecondary: (shade: keyof typeof colors.secondary) => `bg-[${colors.secondary[shade]}]`,
  bgAccent: (shade: keyof typeof colors.accent) => `bg-[${colors.accent[shade]}]`,
  
  // Text colors
  textPrimary: (shade: keyof typeof colors.text) => `text-[${colors.text[shade]}]`,
  
  // Transitions
  transition: (duration: keyof typeof transitions) => `transition-${duration}`,
  
  // Component-specific styles
  card: {
    base: 'bg-[#FAF9F6] border border-[#E8E2D5] rounded-lg shadow-subtle',
    hover: 'hover:shadow-soft hover:border-[#DFD6C4]',
    interactive: 'cursor-pointer transition-all duration-250',
  },
  
  button: {
    primary: 'bg-[#DC143C] text-white hover:bg-[#B91C1C] transition-colors duration-250',
    secondary: 'bg-[#FAF9F6] text-[#1A1A1A] border border-[#E8E2D5] hover:bg-[#F5F2ED] transition-colors duration-250',
    ghost: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F5F2ED] transition-colors duration-250',
  },
  
  input: {
    base: 'bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A] placeholder-[#9A9A9A] focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] transition-colors duration-250',
  }
}
