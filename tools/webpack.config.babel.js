import loadRc from 'rc-config-loader'
import { resolve } from 'path'

console.log([
  resolve(__dirname, '../public'),
  resolve(__dirname, 'assets'),
])

let babelPlugins
const babelConfig = loadRc('babel', {
  configFileName: resolve(__dirname, '../app/.babelrc'),
}).config

if (babelConfig.plugins) {
  babelConfig.plugins.unshift('react-hot-loader/babel')

  babelPlugins = babelConfig.plugins
} else
  babelPlugins = ['react-hot-loader']

const babelConfigForDev = Object.assign({}, babelConfig, {
  babelrc: false,
  plugins: babelPlugins,
  presets: babelConfig.presets.map(preset => (preset === 'env' ? ['env', { modules: false }] : preset)),
})

export default {
  /* Input/output */
  context: resolve(__dirname, '../app'),
  entry: [
    // 'babel-polyfill',
    'react-hot-loader/patch',
    './main', // App's main entry point
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../public/dist'),
    publicPath: 'http://localhost:8080/dist/', // The URL of output.path from the view of the HTML page
  },

  /* Resolvers */
  resolve: {
    alias: {
      components: resolve(__dirname, '../app/components'),
      containers: resolve(__dirname, '../app/containers'),
      pages: resolve(__dirname, '../app/pages'),
      services: resolve(__dirname, '../app/services'),
      duck: resolve(__dirname, '../app/duck'),
    },
  },

  /* Dev mode specific settings */
  devtool: 'source-map',
  devServer: {
    contentBase: resolve(__dirname, '../public'), // Location of static assets (e.g. HTML file)
    /**
     * Recommended to be the same as output.publicPath and
     * needs to be absolute for HMR
     */
    publicPath: 'http://localhost:8080/dist/',
  },

  /* Loaders */
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, '../app'),
        use: [
          // 'react-hot-loader/webpack',
          {
            loader: 'babel-loader',
            options: babelConfigForDev,
          },
        ],
      },
      /* TODO: find out if css modules are still necessary */
      {
        test: /^((?!\.mod).)*css$/, // non CSS-module stylesheets
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
        ],
      },
      {
        test: /\.mod\.css/, // CSS-module stylesheets
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:3]',
            },
          },
        ],
      },
    ],
  },
}
