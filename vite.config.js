import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// base relativo para poder publicar la demo en GitHub Pages o cualquier subcarpeta
export default defineConfig({
  base: './',
  plugins: [react()],
});
