const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        watch: true,
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/], // 배열 대신 객체의 paths 속성을 사용해야 함
            }),
            new RunScriptWebpackPlugin({ name: options.output.filename }),
        ],
    };
};
