/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs","./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Kanit"],
      },
    },
  },
  plugins: [],
};
