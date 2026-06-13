import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    
  },
  //add proxy configuration for development server
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5049',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  //add test configuration for vitest
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      // },
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/**/*.d.ts",
          "src/main.tsx",
          "src/vite-env.d.ts",

          // shadcn generated components
          "src/components/ui/**",
          "src/hooks/use-mobile.ts",
          "src/components/theme-provider.tsx",
          
          // pure types
          "src/types/**",
          
          // utility wrappers
          "src/lib/**",
          
          // test files
          "src/test/**",
          
          //non critical routes
          "src/routes/about/**",
        ]
    },
  },
  
})
