import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist',
    },
    server: {
      open: true,
    },
    base: '/webdev-final-benrzasa/',
  };
});
