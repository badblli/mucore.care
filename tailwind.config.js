/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mucore Care custom colors
        "mucore-primary": "#2563EB",
        "mucore-secondary": "#10B981",
        "mucore-warning": "#F59E0B",
        "mucore-neutral": "#F9FAFB",
        "mucore-text": "#111827",
      },
    },
  },
};
