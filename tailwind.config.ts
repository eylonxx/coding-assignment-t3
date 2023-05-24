import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        lightPurple: "#A18AFF",
        lightGray: "#898897",
        darkPurple: "#987EFF",
      },
      screens: {
        xs: "475px",
        errorInput: "1160px",
      },
    },
  },
  plugins: [],
} satisfies Config;
