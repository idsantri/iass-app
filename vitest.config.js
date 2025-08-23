import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// export default mergeConfig(
//   viteConfig,
//   defineConfig({
//     test: {
//       environment: 'jsdom',
//       exclude: [...configDefaults.exclude, 'e2e/**'],
//       root: fileURLToPath(new URL('./', import.meta.url)),
//     },
//   }),
// )

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.test.{js,ts,jsx,tsx}', // Test file JS & TS
    ],
    globals: true,
    setupFiles: ['./src/models/tests/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
