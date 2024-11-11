/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your setup
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        russo: ["Russo One", "sans-serif"],
        kdamThmorPro: ["Kdam Thmor Pro", "sans-serif"],
        lorniasolid: ["Londrina Solid", "sans-serif"],
        bebasneue: ["Bebas Neue", "sans-serif"],
        bricolagegrotesque: ["Bricolage Grotesque", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
        ibmplexsans: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        primary: "#E76F51",
        secondary: "#5C646C",
        light: "#F4F4F4",
        dark: "#212529",
        baseextra2: "#E76F51",
        baseextra3: "#212529",
        baseextra4: "#02203c",
        baseextra5: "#171614",
        baseextra6: "#FFFFFF",
        baseextra7: "#000000",
      },
      screens: {
        sms: { min: "10px", max: "640px" }, // screens <= 640px
        mds: { min: "641px", max: "1023px" }, // screens <= 1023px
        lgs: { min: "1024px", max: "5000px" }, // screen <= 1536px
      },
      inset: {
        5: "5px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {},
};
