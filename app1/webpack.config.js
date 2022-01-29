const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
	entry: "./src/index.ts",
	mode: "development",
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 3001,
		open: true,
	},
	output: {
		publicPath: "http://localhost:3001/",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|tsx|ts)$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "app1",
			library: { type: "var", name: "app1" },
			filename: "remoteEntry.js",
			exposes: {
				// expose each component
				"./CounterAppOne": "./src/components/CounterAppOne",
			},
			shared: {
				...deps,
				react: { singleton: true, eager: true, requiredVersion: deps.react },
				"react-dom": {
					singleton: true,
					eager: true,
					requiredVersion: deps["react-dom"],
				},
			},
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
};
