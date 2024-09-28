// const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
// const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
//
// module.exports = function (options) {
//     return {
//         ...options,
//         entry: ['webpack/hot/poll?100', options.entry],
//         watch: true,
//         externals: [
//             nodeExternals({
//                 allowlist: ['webpack/hot/poll?100'],
//             }),
//         ],
//         plugins: [
//             ...options.plugins,
//             new webpack.HotModuleReplacementPlugin(),
//             new webpack.WatchIgnorePlugin({
//                 paths: [/\.js$/, /\.d\.ts$/], // 배열 대신 객체의 paths 속성을 사용해야 함
//             }),
//             new RunScriptWebpackPlugin({ name: options.output.filename }),
//         ],
//     };
// };

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/],
            }),
            new RunScriptWebpackPlugin({ name: options.output.filename }),
        ],
    };
};
