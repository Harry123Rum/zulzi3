import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/main.jsx',
                'resources/js/app.jsx'
            ],

            refresh: true,
        }),
        react(),  // ← HAPUS fastRefresh: false
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
});
