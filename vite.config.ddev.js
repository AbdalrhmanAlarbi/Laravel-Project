// vite.config.ddev.js - Configuration for ddev development
// Use this when running: ddev start (current setup)

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'newproject.ddev.site',
            protocol: 'wss',  // Secure WebSocket for HTTPS
            port: 5173,
        },
    },

    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
});

