module.exports = {
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 10s linear infinite reverse',
                'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'flicker': 'flicker 1.5s ease-in-out infinite',
                'bounce-wave': 'bounce-wave 1.2s ease-in-out infinite',
                'swing-wide': 'swing-wide 2s ease-in-out infinite',
            },
            keyframes: {
                'spin-slow': {
                    '0%': {
                        transform: 'rotate(0deg)'
                    },
                    '100%': {
                        transform: 'rotate(-360deg)'
                    },
                },
                'pulse-fast': {
                    '0%, 100%': {
                        transform: 'scale(1)'
                    },
                    '50%': {
                        transform: 'scale(1.1)'
                    },
                },
                'flicker': {
                    '0%, 100%': {
                        opacity: '1'
                    },
                    '50%': {
                        opacity: '0.7'
                    },
                },
                'bounce-wave': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-15px)'
                    },
                    '75%': {
                        transform: 'translateY(-5px)'
                    },
                },
                'swing-wide': {
                    '0%, 100%': {
                        transform: 'rotate(0deg)'
                    },
                    '25%': {
                        transform: 'rotate(10deg)'
                    },
                    '75%': {
                        transform: 'rotate(-10deg)'
                    },
                },
            },
        },
    },
    plugins: [],
};