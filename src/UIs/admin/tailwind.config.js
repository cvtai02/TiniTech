const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.jsx',
    './components/**/*.jsx',
    './layouts/**/*.jsx',
    './lib/**/*.jsx',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['UVN_R', ...defaultTheme.fontFamily.sans],
        cambria: ['Cambria', ...defaultTheme.fontFamily.serif],
        uvn: ['UVN_B', ...defaultTheme.fontFamily.sans],
      },
      gradientColorStops: {
        // https://coolors.co/2d00f7-6a00f4-8900f2-a100f2-b100e8-bc00dd-d100d1-db00b6-e500a4-f20089
        'gradient-1-start': '#F20089',
        'gradient-1-end': '#D100D1',
        'gradient-2-start': '#D100D1',
        'gradient-2-end': '#A100F2',
        'gradient-3-start': '#A100F2',
        'gradient-3-end': '#2D00F7',
      },
      colors: {
        primary: {
          100: '#f4e6fa',
          200: '#e3c7f7',
          300: '#d6acf7',
          400: '#ca8af8',
          500: '#AB57E9',
          600: '#8D37CC',
          700: '#7122AB',
          800: '#5E1B8F',
          900: '#490C75',
        },
        secondary: {
          100: '#FDD1D9',
          200: '#FBA4BC',
          300: '#F575A5',
          400: '#EB519B',
          500: '#DE1D8D',
          600: '#BE1588',
          700: '#9F0E7F',
          800: '#800972',
          900: '#6A0568',
        },
        tertiary: {
          100: '#D1F6E6',
          200: '#A4F2D3',
          300: '#75EEC0',
          400: '#51EAAE',
          500: '#1DE69B',
          600: '#15C388',
          700: '#0E9F76',
          800: '#097C63',
          900: '#056950',
        },
        quaternary: {
          100: '#F4E1CC',
          200: '#EFCDA7',
          300: '#E9B983',
          400: '#E3A75E',
          500: '#DE932A',
          600: '#C47A26',
          700: '#AA6121',
          800: '#90471D',
          900: '#762D18',
        },
        'background-color': '#000',
        green: colors.emerald,
        gray: colors.neutral,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '20px',
            color: theme('colors.gray.700'),

            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontSize: '38px',
              fontWeight: '900',
              color: theme('colors.gray.900'),
              letterSpacing: '0.05em',
            },
            h2: {
              fontSize: '34px',
              fontWeight: '900',
              color: theme('colors.gray.900'),
              justifyContent: 'center',
              textAlign: 'center',
              letterSpacing: '-0.06em',
            },
            h3: {
              fontSize: '30px',
              fontWeight: '800',
              color: theme('colors.gray.800'),
              letterSpacing: '-0.05em',
            },
            h4: {
              fontSize: '24px',
              fontWeight: '700',
              color: theme('colors.gray.700'),
              letterSpacing: '-0.04em',
            },
            h5: {
              fontSize: '20px',
              fontWeight: '700',
              color: theme('colors.gray.700'),
              marginTop: '25px',
              letterSpacing: '-0.03em',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.green.600'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            '[class~="code-line"]': {
              fontSize: '14px',
              letterSpacing: '-0.02em',
            },
            details: {
              textIndent: '0px',
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.gray.200') },
            ol: {
              marginLeft: '30px',
            },
            ul: {
              marginLeft: '30px',
            },
            li: {
              letterSpacing: '-0.02em',
            },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.700'),
            },
            'ul li::marker': {
              fontWeight: '600',
              backgroundColor: theme('colors.gray.700'),
            },
            strong: { color: theme('colors.gray.700') },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.100'),
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingRight: '20px',
              marginLeft: '30px',
              borderRadius: '20px',
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
            'p:first-of-type': {
              textIndent: '0px',
            },
            p: {
              textIndent: '30px',
              textAlign: 'justify',
              marginTop: '10px',
              marginBottom: '10px',
              textUnderlineOffset: '3px',
              letterSpacing: '-0.02em',
            },
            figcaption: {
              textAlign: 'center',
              fontFamily: 'UVN_R',
              letterSpacing: '0.02em',
              color: theme('colors.gray.400'),
            },
            '[class~="math-display"]': {
              textAlign: 'center',
              overflowX: 'auto',
              width: '100%',
            },
            '[class~="tag"]': {
              paddingLeft: '10px',
              paddingRight: '2px',
            },
            img: {
              //w-full md:w-1/2 flex justify-center mx-auto
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '100%',
              height: 'auto',
            },
            table: {
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 'auto',
              tableLayout: 'auto',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: `${theme('colors.primary.400')} `,
              },
              code: {
                color: theme('colors.primary.600'),
              },
            },
            h1: {
              fontSize: '38px',
              fontWeight: '900',
              color: theme('colors.gray.100'),
            },
            h2: {
              fontSize: '34px',
              fontWeight: '900',
              color: theme('colors.gray.100'),
            },
            h3: {
              fontSize: '30px',
              fontWeight: '800',
              color: theme('colors.gray.100'),
            },
            h4: {
              fontSize: '26px',
              fontWeight: '700',
              color: theme('colors.gray.100'),
            },
            h5: {
              fontSize: '22px',
              fontWeight: '600',
              color: theme('colors.gray.100'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.green.400'),
              backgroundColor: theme('colors.gray.800'),
            },
            details: {
              textIndent: '0px',
              backgroundColor: theme('colors.gray.800'),
            },
            hr: { borderColor: theme('colors.gray.700') },
            'ol li::marker': {
              textIndent: '0px',
              color: theme('colors.gray.300'),
            },
            'ul li::marker': {
              textIndent: '0px',
              backgroundColor: theme('colors.gray.300'),
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              th: {
                color: theme('colors.gray.100'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
              backgroundColor: theme('colors.gray.900'),
            },

            figcaption: {
              textAlign: 'center',
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
      keyframes: {
        shrink: {
          '0% , 100%': {
            height: '0.75rem',
          },
          '50%': {
            height: '0.375rem',
          },
        },
        'bg-hue-animation': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(180deg)' },
          '100%': { filter: 'hue-rotate(0deg)' },
        },
        'fade-away': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0.2,
          },
        },
        expand: {
          '0% , 100%': {
            height: '0.375rem',
          },
          '50%': {
            height: '0.75rem',
          },
        },
        'gradient-foreground-1': {
          '0%, 16.667%, 100%': {
            opacity: 1,
          },
          '33.333%, 83.333%': {
            opacity: 0,
          },
        },
        'gradient-background-1': {
          '0%, 16.667%, 100%': {
            opacity: 0,
          },
          '25%, 91.667%': {
            opacity: 1,
          },
        },
        'gradient-foreground-2': {
          '0%, 100%': {
            opacity: 0,
          },
          '33.333%, 50%': {
            opacity: 1,
          },
          '16.667%, 66.667%': {
            opacity: 0,
          },
        },
        'gradient-background-2': {
          '0%, to': {
            opacity: 1,
          },
          '33.333%, 50%': {
            opacity: 0,
          },
          '25%, 58.333%': {
            opacity: 1,
          },
        },
        'gradient-foreground-3': {
          '0%, 50%, 100%': {
            opacity: 0,
          },
          '66.667%, 83.333%': {
            opacity: 1,
          },
        },
        'gradient-background-3': {
          '0%, 58.333%, 91.667%, 100%': {
            opacity: 1,
          },
          '66.667%, 83.333%': {
            opacity: 0,
          },
        },
      },
      animation: {
        'fade-text': '10s ease-in-out 3s 1 normal forwards running fade-away',
        shrink: 'shrink ease-in-out 1.5s infinite',
        expand: 'expand ease-in-out 1.5s infinite',
        'hue-animation': 'bg-hue-animation 10s infinite',
        'gradient-background-1': 'gradient-background-1 8s infinite',
        'gradient-foreground-1': 'gradient-foreground-1 8s infinite',
        'gradient-background-2': 'gradient-background-2 8s infinite',
        'gradient-foreground-2': 'gradient-foreground-2 8s infinite',
        'gradient-background-3': 'gradient-background-3 8s infinite',
        'gradient-foreground-3': 'gradient-foreground-3 8s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
  ],
};
