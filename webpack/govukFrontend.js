const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve(require.resolve('govuk-frontend/package.json'), '..', 'dist', 'govuk');
const assets = path.resolve(root, 'assets');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [{ from: assets, to: 'assets' }],
});

module.exports = {
  plugins: [copyGovukTemplateAssets],
};
