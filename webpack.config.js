const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js', //Point of entry of the app
    output: { //Output of my bundle
        path: path.resolve(__dirname, 'dist'), //Resolve help us, giving us the absolute route of the O.S, to not have conflicts between Linux, windows, etc.
        filename: '[name].[contenthash].js', //The name of the final file
        assetModuleFilename: 'assets/images/[hash][ext][query]' 
    },
    resolve: {
        extensions: ['.js'], //The type of the extensions that webpack will read 
        alias: {
            '@utils' : path.resolve(__dirname, 'src/utils/'),
            '@templates' : path.resolve(__dirname, 'src/templates/'),
            '@styles' : path.resolve(__dirname, 'src/styles/'),
            '@images' : path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: { 
        // Rules that webpack will work with  
        rules: [
            {
                test: /\.m?js$/, //Read the files with extension mjs or js
                exclude: /node_modules/, //Ignore the files and them childs declared
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader',
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,// O LE PASAMOS UN BOOLEANOS TRUE O FALSE
                        // Habilita o deshabilita la transformación de archivos en base64.
                        mimetype: "application/font-woff", // Especifica el tipo MIME con el que se alineará el archivo. 
                        // Los MIME Types (Multipurpose Internet Mail Extensions)
                        // son la manera standard de mandar contenido a través de la red.
                        name: "[name].[contenthash].[ext]", // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
                        // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria 
                        // ubuntu-regularhola.woff
                        outputPath: ".assets/fonts/", // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
                        publicPath: "../assets/fonts/", // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
                        esModule: false, // AVISAR EXPLICITAMENTE SI ES UN MODULO 
                    }
                }
            }
        ]
    },
    //PLugins
    plugins: [
        new HtmlWebpackPlugin({
            //Plugin configuration 
            inject: true, //Injects the bundle to the Template HTML 
            template: './public/index.html', //Route towards Template HTML
            filename: './index.html', //Final name of the file
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin(), //A plugin that cleans our files, (it reflects into the assets files) 
        //to have the lastest version of our project.
    ], 
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    }
}

