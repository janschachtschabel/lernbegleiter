import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Expose system environment variables to the client
    'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
    'process.env.GWDG_API_KEY': JSON.stringify(process.env.GWDG_API_KEY),
  },
  server: {
    proxy: {
      '^/api/edu-sharing/rest/': {
        target: 'https://redaktion.openeduhub.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // Add CORS headers in development
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        }
      },
      '^/api/openai/': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add OpenAI API key from environment
            if (process.env.VITE_OPENAI_API_KEY) {
              proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_OPENAI_API_KEY}`);
            }
          });
        }
      },
      '^/api/gwdg/': {
        target: 'https://chat-ai.academiccloud.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gwdg/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add GWDG API key from environment
            if (process.env.VITE_GWDG_API_KEY) {
              proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_GWDG_API_KEY}`);
            }
          });
        }
      }
    },
  },
});
