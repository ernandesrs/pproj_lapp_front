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
import colors from 'vuetify/lib/util/colors'

const myThemeColors = {
  'sidebar': colors.grey.darken4,

  'primary': colors.indigo.darken1,
  'secondary': colors.deepPurple.lighten1,
  'light': colors.blueGrey.lighten5,
  'dark': colors.blueGrey.darken4,
  'success': colors.green.lighten1,
  'info': colors.blue.lighten1,
  'warning': colors.yellow.lighten1,
  'danger': colors.red.lighten1
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    variations: {
      colors: ['sidebar', 'primary', 'secondary', 'light', 'dark', 'success', 'info', 'warning', 'danger'],
      lighten: 4,
      darken: 4
    },
    themes: {
      light: {
        colors: {
          ...myThemeColors
        },
      },
      dark: {
        dark: true,
        colors: {
          ...myThemeColors
        }
      }
    },
  },
})
