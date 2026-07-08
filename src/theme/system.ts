/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      bg: 'ink.50',
      color: 'ink.900',
      fontFamily: 'sans',
    },
    '::selection': {
      bg: 'brand.200',
      color: 'ink.900',
    },
  },
  theme: {
    tokens: {
      colors: {
        ink: {
          50: { value: '#f5f7fa' },
          100: { value: '#e9eef4' },
          200: { value: '#cfd9e6' },
          300: { value: '#a7b8cf' },
          400: { value: '#7891b3' },
          500: { value: '#56719a' },
          600: { value: '#425a82' },
          700: { value: '#374a6b' },
          800: { value: '#2f3f59' },
          900: { value: '#1a2538' },
          950: { value: '#0f1726' },
        },
        brand: {
          50: { value: '#ecfdf8' },
          100: { value: '#d1faec' },
          200: { value: '#a7f3da' },
          300: { value: '#6ee7c3' },
          400: { value: '#34d3a6' },
          500: { value: '#10b981' },
          600: { value: '#059669' },
          700: { value: '#047857' },
          800: { value: '#065f46' },
          900: { value: '#064e3b' },
        },
        gold: {
          400: { value: '#f5c451' },
          500: { value: '#eab308' },
          600: { value: '#ca8a04' },
        },
      },
      fonts: {
        sans: { value: `'Inter', system-ui, sans-serif` },
        display: { value: `'Plus Jakarta Sans', system-ui, sans-serif` },
      },
      shadows: {
        soft: { value: '0 1px 2px rgba(15, 23, 38, 0.04), 0 8px 24px rgba(15, 23, 38, 0.06)' },
        glow: { value: '0 0 0 1px rgba(16, 185, 129, 0.15), 0 12px 40px rgba(16, 185, 129, 0.18)' },
      },
      animations: {
        fadeUp: { value: 'fadeUp 0.6s ease-out both' },
        fadeIn: { value: 'fadeIn 0.5s ease-out both' },
        float: { value: 'float 6s ease-in-out infinite' },
        pulseRing: { value: 'pulseRing 2.5s ease-out infinite' },
      },
    },
    keyframes: {
      fadeUp: {
        '0%': { opacity: 0, transform: 'translateY(12px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      pulseRing: {
        '0%': { transform: 'scale(0.95)', opacity: 0.7 },
        '70%': { transform: 'scale(1.3)', opacity: 0 },
        '100%': { opacity: 0 },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          contrast: { value: 'white' },
          fg: { value: '{colors.brand.700}' },
          subtle: { value: '{colors.brand.50}' },
          muted: { value: '{colors.brand.100}' },
          emphasized: { value: '{colors.brand.200}' },
          solid: { value: '{colors.brand.600}' },
          focusRing: { value: '{colors.brand.500}' },
          border: { value: '{colors.brand.300}' },
        },
        ink: {
          contrast: { value: 'white' },
          fg: { value: '{colors.ink.800}' },
          subtle: { value: '{colors.ink.50}' },
          muted: { value: '{colors.ink.100}' },
          emphasized: { value: '{colors.ink.200}' },
          solid: { value: '{colors.ink.900}' },
          focusRing: { value: '{colors.ink.400}' },
          border: { value: '{colors.ink.200}' },
        },
      },
    },
    slotRecipes: {
      card: {
        slots: ['root', 'header', 'body', 'footer', 'title', 'description'],
        variants: {
          variant: {
            custom: {
              root: {
                bg: 'white',
                borderRadius: '2xl',
                borderWidth: '1px',
                borderColor: 'ink.100',
                boxShadow: 'soft',
              },
            },
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
