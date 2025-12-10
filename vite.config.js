import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
    },
    base: '/webdev-final-benrzasa/',
  };
});
