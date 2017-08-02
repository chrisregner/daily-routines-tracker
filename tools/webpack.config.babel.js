import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import loadRc from 'rc-config-loader'
import { resolve } from 'path'

// DISCLAIMER: some parts are copied from kriasoft's react-starter-kit

const isProd = process.env.NODE_ENV === 'production'
const publicPathBase = isProd ? '/daily-routines-tracker' : ''

const babelConfigOrig = loadRc('babel', {
  configFileName: resolve(__dirname, '../app/.babelrc'),
}).config

let babelPlugins = babelConfigOrig.plugins

// If on dev mode, add the 'react-hot-loader/babel' babel plugin
if (!isProd)
  if (babelConfigOrig.plugins) {
    babelConfigOrig.plugins.unshift('react-hot-loader/babel')

    babelPlugins = babelConfigOrig.plugins
  } else {
    babelPlugins = ['react-hot-loader']
  }

// 1) Disable the use of .babelrc (we'll use the modified one above in the babel-loader's option)
// 2) Disable the modules of babel preset 'env' (to use the webpack's modules system instead)
const babelConfigModified = Object.assign({}, babelConfigOrig, {
  babelrc: false,
  plugins: babelPlugins,
  presets: babelConfigOrig.presets.map(preset => (preset === 'env' ? ['env', { modules: false }] : preset)),
})

// The Actual config
export default {
  /* Input/output */
  context: resolve(__dirname, '../app'),
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './main', // App's main entry point
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../public/dist'),
    publicPath: publicPathBase + '/dist/', // The URL of output.path from the view of the HTML page
  },

  /* Resolvers */
  resolve: {
    alias: {
      components: resolve(__dirname, '../app/components'),
      containers: resolve(__dirname, '../app/containers'),
      constants: resolve(__dirname, '../app/constants'),
      pages: resolve(__dirname, '../app/pages'),
      services: resolve(__dirname, '../app/services'),
      duck: resolve(__dirname, '../app/duck'),
    },
  },

  /* Dev mode specific settings */
  devtool: isProd ? 'source-map' : 'cheap-module-inline-source-map',
  devServer: {
    contentBase: resolve(__dirname, '../public'), // Location of static assets (e.g. HTML file)
    // Recommended to be the same as output.publicPath and
    // needs to be absolute for HMR
    publicPath: publicPathBase + '/dist/',
  },

  /* Loaders */
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, '../app'),
        use: [
          {
            loader: 'babel-loader',
            options: babelConfigModified,
          },
        ],
      },
      {
        test: /\.css/,
        use: (isProd
          ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: resolve(__dirname, 'postcss.config.js'),
                  },
                },
              },
            ],
          })
          : [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
          ]),
      },
    ],
  },

  // Misc
  bail: isProd, // Don't attempt to continue if there are any errors.

  // Plugins
  plugins: [
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProd ? "'production'" : "'development'",
      'process.env.PUBLIC_URL': `'${publicPathBase}'`,
    }),

    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.ejs'),
      filename: resolve(__dirname, '../public/index.html'),
    }),

    ...(isProd
      ? [
        // Extract CSS to a different file instead of inlining it with js
        new ExtractTextPlugin('styles.css'),

        // Decrease script evaluation time
        // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
        new webpack.optimize.ModuleConcatenationPlugin(),

        // Minimize all JavaScript output of chunks
        new webpack.optimize.UglifyJsPlugin(),

        // Gzip it
        new CompressionPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }),

        // Create a report of plugin sizes
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      ]
      : []),
  ],
}
