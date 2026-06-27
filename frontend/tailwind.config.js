/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "primary-variant": "rgb(var(--color-primary-variant) / <alpha-value>)",
        
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-variant": "rgb(var(--color-secondary-variant) / <alpha-value>)",
        
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        "on-tertiary": "rgb(var(--color-on-tertiary) / <alpha-value>)",
        
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
      },
      fontFamily: {
        "display-lg": ["Literata", "serif"],
        "headline-md": ["Literata", "serif"],
        "body-lg": ["Geist", "sans-serif"],
        "body-md": ["Geist", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em" }],
        "headline-md": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        "body-md": ["16px", { lineHeight: "24px" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", textTransform: "uppercase" }],
      },
      spacing: {
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "32px",
        "xl": "48px",
        "margin": "24px", // Safe area
      },
      boxShadow: {
        "elegant": "0 4px 20px rgba(0, 0, 0, 0.03)",
        "elegant-hover": "0 10px 40px rgba(0, 0, 0, 0.06)",
      }
    },
  },
  plugins: [],
}
