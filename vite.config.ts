import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  if (isLib) {
    return {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'ContentaAssistantWidget',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'style.css';
              return assetInfo.name;
            }
          }
        },
        cssCodeSplit: false
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
