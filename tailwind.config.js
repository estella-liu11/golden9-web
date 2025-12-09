/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#8B5CF6',
                admin: '#DC2626',
                gray: {
                    light: '#F3F4F6',
                    medium: '#E5E7EB',
                },
            },
        },
    },
    plugins: [],
}

