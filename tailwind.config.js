/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dentro do 'content', este caminho escrito que contém HTML e JS, mostra que os arquivos dentro da nossa pasta que termina com esses dois, podem usar o Tailwind CSS.
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    // Extender nova propriedade
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

