const slsw = require('serverless-webpack')
const { DefinePlugin } = require('webpack')
const path = require('path')
const fs = require('fs')
const schemaPath = 'src/schema/'
const schemaFileName = 'sensors.json'
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, `${schemaPath}${schemaFileName}`), 'utf8'))
process.env.SCHEMA = JSON.stringify(schema)

module.exports = {
    entry: slsw.lib.entries,
    devtool: 'eval-source-map',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name].js'
    },
    optimization: { minimize: false },
    target: 'node',
    mode: 'production',
    node: { __dirname: true },
    plugins: [new DefinePlugin({ 'process.env.SCHEMA': JSON.stringify(process.env.SCHEMA) })]
}
