const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push({
  test: /\.sass$/,
  use: [
    "style-loader",
    "@teamsupercell/typings-for-css-modules-loader",
    {
      loader: "css-loader",
      options: { modules: true },
    },
    "sass-loader",
  ],
});

rules.push({
  test: /\.svg$/,
  use: [
    "babel-loader",
    {
      loader: "react-svg-loader",
      options: {
        jsx: true, // true outputs JSX tags
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
