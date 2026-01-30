/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tens-purple': '#7C68FA',
        'slate-plus': '#EDEFF9',
        'tt-black': '#202020',
        'accent-blue': '#5164E0',
        'accent-teal': '#3EB7DE',
      },
      fontFamily: {
        display: ['DegularDisplay', 'system-ui', 'sans-serif'],
        body: ['Degular', 'system-ui', 'sans-serif'],
        mono: ['RMMono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
