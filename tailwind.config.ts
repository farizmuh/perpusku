import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00236f',
        'primary-container': '#1e3a8a',
        'on-primary': '#ffffff',
        'on-primary-container': '#90a8ff',
        'primary-fixed': '#dce1ff',
        'primary-fixed-dim': '#b6c4ff',
        'on-primary-fixed': '#00164e',
        'on-primary-fixed-variant': '#264191',
        'inverse-primary': '#b6c4ff',

        'secondary': '#904d00',
        'secondary-container': '#fe932c',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#663500',
        'secondary-fixed': '#ffdcc3',
        'secondary-fixed-dim': '#ffb77d',
        'on-secondary-fixed': '#2f1500',
        'on-secondary-fixed-variant': '#6e3900',

        'tertiary': '#222a3e',
        'tertiary-container': '#384055',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#a4acc5',
        'tertiary-fixed': '#dae2fd',
        'tertiary-fixed-dim': '#bec6e0',
        'on-tertiary-fixed': '#131b2e',
        'on-tertiary-fixed-variant': '#3f465c',

        'background': '#f7f9fb',
        'surface': '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-bright': '#f7f9fb',
        'surface-variant': '#e0e3e5',
        'surface-tint': '#4059aa',

        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',

        'on-background': '#191c1e',
        'on-surface': '#191c1e',
        'on-surface-variant': '#444651',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',

        'outline': '#757682',
        'outline-variant': '#c5c5d3',

        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a'
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Merriweather', 'serif'],
        headline: ['Merriweather', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px'
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(15, 23, 42, 0.05)',
        card: '0 2px 10px -2px rgba(15, 23, 42, 0.06)',
        elevated: '0 12px 32px -4px rgba(15, 23, 42, 0.12)'
      }
    }
  }
}
