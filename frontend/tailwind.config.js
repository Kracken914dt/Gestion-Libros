/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slateDeep: '#07162f',
        slatePanel: '#0c2142',
        slateCard: '#11284f',
        electric: '#5f55ff',
        electricSoft: '#7f78ff',
      },
      boxShadow: {
        glow: '0 12px 50px rgba(84, 70, 255, 0.2)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(95,85,255,0.2), transparent 35%), radial-gradient(circle at 80% 0%, rgba(0,203,255,0.12), transparent 40%), linear-gradient(180deg, #061427 0%, #041126 100%)',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
