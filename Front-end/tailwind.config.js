/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF7622",
        input: "#F0F5FA",
        orange: {
          100: "#FFE1CE"
        },
        colorText: "#1E1D1D",
        search: "#F6F6F6"
      }
    },
  },
  plugins: [],
}