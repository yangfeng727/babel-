// 注意html-webpack-plugin,webpack,webpack-cli,extract-text-webpack-plugin 的版本是否对应
// extract-text-webpack-plugin不支持webpack4
// html-webpack-plugin需要和webpack版本一致,webpack是4那么html-webpack-plugin也要是4
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 注意该插件在loader和plugin中都有使用
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将css单独打包成css，不使用extract-text-webpack-plugin的话webpack将会把css和js打包到一起
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const WebpackBar = require('webpackbar'); // webpack进度条
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const env = process.env.WEB_ENV || 'dev';
console.log('项目根目录:' + __dirname)
module.exports = {
	mode: 'production',
	entry: {
		index: path.resolve(__dirname, './src/index.js'), // __dirname 绝对路径,如 D:\web前端\babel学习\babel+webpack
	},
	output: {
		path: path.resolve(__dirname, './dist'), //打包输出的地址
		filename: "[name].[hash:7].bundle.js", //输出的文件名称
		chunkFilename: '[name].bundle.js',
		publicPath: './',
	},
	module: {
		rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader'],
				}),
			}
		]
	},
	plugins: [
		new WebpackBar(),
		new CleanWebpackPlugin(), // 删除的正是output.path
		new HtmlWebpackPlugin({
			/*
			template 参数指定入口 html 文件路径，插件会把这个文件交给 webpack 去编译，
			webpack 按照正常流程，找到 loaders 中 test 条件匹配的 loader 来编译，那么这里 html-loader 就是匹配的 loader
			html-loader 编译后产生的字符串，会由 html-webpack-plugin 储存为 html 文件到输出目录，默认文件名为 index.html
			可以通过 filename 参数指定输出的文件名
			html-webpack-plugin 也可以不指定 template 参数，它会使用默认的 html 模板。
			*/
			template: './src/index.html',
			/*
			因为和 webpack 4 的兼容性问题，chunksSortMode 参数需要设置为 none
			https://github.com/jantimon/html-webpack-plugin/issues/870
			*/
			chunksSortMode: 'none'
		}),
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			allChunks: true, // 当为false的时候，之后提取初始化的时候引入的css，当chunks为true时，会把异步引入的css也提取出来。
		}),
	],
	// optimization: { // 从webpack4开始官方移除了commonchunk插件，改用了optimization属性进行更加灵活的配置，这也应该是从V3升级到V4的代码修改过程中最为复杂的一部分
	//   minimize: env === 'dev' ? false : true, // true默认情况下的production模式。
	//   minimizer: [ // 使用第三方的压缩插件UglifyJsPlugin
	//     new OptimizeCSSAssetsPlugin({}),
	//   ]
	// },
}
