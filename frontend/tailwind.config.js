export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  presets: [require("tailwindcss/preset")()],

  experimental: {
    disableDesignSystem: true,
  },

  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
    },
  },
};
