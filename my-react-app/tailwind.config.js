/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Ensure .js and .jsx files are covered
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174
  }
});

