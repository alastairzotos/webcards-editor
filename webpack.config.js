const path = require('path');

module.exports = {
    mode: "development",

    entry: {
        index: path.resolve(__dirname, 'src/index.tsx'),
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    }
                ],

                include: path.resolve(__dirname, "src"),
                exclude: /(node_modules|\.git)$/,
            },

            { test: /\.css$/i, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },

    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        minimize: false
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    output: {
        filename: '[name].js',
        pathinfo: false,
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/'
    },

    //watch: process.env.MODE == "development",
    stats: "minimal"
};
