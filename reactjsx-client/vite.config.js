const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  build: {
    // Output to Flask's static folder
    outDir: '../../Flask-backend/static',
    emptyOutDir: true,
    sourcemap: true,
    // Generate a single CSS file
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8080,
    hot: true
  }
}