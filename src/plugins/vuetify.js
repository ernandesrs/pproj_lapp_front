/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          'primary-1': '#5eead4',
          'primary-2': '#2dd4bf',
          'primary-3': '#14b8a6',

          'secondary-1': '#67e8f9',
          'secondary-2': '#22d3ee',
          'secondary-3': '#06b6d4',

          'light-1': '#f1f5f9',
          'light-2': '#cbd5e1',
          'light-3': '#94a3b8',

          'dark-1': '#374151',
          'dark-2': '#1e293b',
          'dark-3': '#0f172a',

          'success-1': '#86efac',
          'success-2': '#4ade80',
          'success-3': '#22c55e',

          'info-1': '#60a5fa',
          'info-2': '#3b82f6',
          'info-3': '#2563eb',

          'warning-1': '#fde68a',
          'warning-2': '#fcd34d',
          'warning-3': '#fbbf24',

          'danger-1': '#f87171',
          'danger-2': '#ef4444',
          'danger-3': '#dc2626'
        },
      },
    },
  },
})
