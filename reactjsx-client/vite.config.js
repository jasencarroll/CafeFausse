const path = require('path')

export default {
  // Give Vite the root directory for the front end app
  root: path.resolve(__dirname, 'src'),
  // Add Bootstrap styling
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  // Setup a server using Vite with a proxy to the backend Flask server. 
  server: {
    port: 8080,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
}