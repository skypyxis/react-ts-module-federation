const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // only add this if you don't have yet
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const deps = require('./package.json').dependencies;
require('dotenv').config({ path: './.env' });

const buildDate = new Date().toLocaleString();

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    console.log({ isProduction });

    function lazyLoadRemote(remoteUrl, appName) {
        return `promise new Promise(resolve => {
        const script = document.createElement('script')
        script.src = '${remoteUrl}'
    
        console.log('lazyLoadRemote', script.src);

        script.onload = () => {
          // the injected script has loaded and is available on window
          // we can now resolve this Promise
          const proxy = {
            get: (request) => window.${appName}.get(request),
            init: (arg) => {
              try {
                return window.${appName}.init(arg)
              } catch(e) {
                console.log('remote container already initialized', e)
              }
            }
          }
          resolve(proxy)
        }
        // inject this script with the src set to the versioned remoteEntry.js
        document.head.appendChild(script);
      })`;
    }


    return {
        entry: './src/index.ts',
        mode: process.env.NODE_ENV || 'development',
        devServer: {
            port: 3000,
            open: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            // 'react-hot-loader/babel',
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ],
                    },
                },
                {
                  test: /\.s[ac]ss$/i,
                  use: [
                      // Creates `style` nodes from JS strings
                      'style-loader',
                      // Translates CSS into CommonJS
                      'css-loader',
                      // Compiles Sass to CSS
                      'sass-loader',
                  ],
              },
            ],
        },

        plugins: [
            new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(process.env),
            }),
            new ModuleFederationPlugin({
                name: 'container',
                remotes: {
                    app1: `app1@${isProduction ? process.env.PROD_APP1 : process.env.DEV_APP1}`,
                    app2: `app2@${isProduction ? process.env.PROD_APP2 : process.env.DEV_APP2}`,
                    // app1: lazyLoadRemote(isProduction ? process.env.PROD_APP1 : process.env.DEV_APP1, 'app1'),
                    // app2: lazyLoadRemote(isProduction ? process.env.PROD_APP2 : process.env.DEV_APP2, 'app2'),
                },
                shared: {
                    ...deps,
                    react: { singleton: true, eager: true, requiredVersion: deps.react },
                    'react-dom': {
                        singleton: true,
                        eager: true,
                        requiredVersion: deps['react-dom'],
                    },
                },
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new ForkTsCheckerWebpackPlugin(),
        ],
    };
};
