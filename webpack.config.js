/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = Boolean(env?.analyze);
  
  /** @type {import('webpack').Configuration} **/
  const config = {
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/media/[name].[hash:6][ext]'
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/, 
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/fonts/[name].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },
    output: {
      filename: 'static/js/[name].[contenthash:6].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    devServer: {
      hot: true,
      port: 3000,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'public'),
        watch: true
      },
      proxy: {
        '/api': {
          target: 'http://localhost:1011',
          pathRewrite: { '^/api': '' }
        }
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:6].css'
      }),
      new Dotenv(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => !name.endsWith('index.html')
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      // new ESLintPlugin({
      //   extensions: ['.tsx', '.ts', '.js', '.jsx']
      // })
    ]
  };

  if (isProduction) {
    config.plugins.push(
      new webpack.ProgressPlugin(),
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin()
    );
    if (isAnalyze) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    config.optimization = {
      minimizer: [
        `...`,
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all'
      }
    };
  }
  return config;
};