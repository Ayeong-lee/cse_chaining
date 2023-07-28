const {defineConfig} = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
        transpileDependencies: true,
        publicPath: process.env.NODE_ENV === 'production' ? './' : '',
        outputDir: path.resolve(__dirname, './../../backend-main/backend-main/public'),
        devServer: {
            proxy: {
                '/api': {
                    target: 'https://127.0.0.1:3000/api',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '',
                    },
                },
            },
        },
    }
)