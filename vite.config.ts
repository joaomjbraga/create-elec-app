import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: !process.argv.slice(2).includes('--watch'),
    target: 'node18',
    lib: {
      entry: 'src/index',
      formats: ['es'],
      fileName: () => '[name].mjs',
    },
    rollupOptions: {
      external: [
        'electron',
        'vite',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
})
