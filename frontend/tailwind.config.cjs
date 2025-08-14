/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        user: "#e3f2fd",
        gpt: "#f3e5f5",
        claude: "#fff3e0",
      }
    }
  },
  plugins: [],
};