const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const path = require('path');

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);
  config.resolve.modules = [
    path.resolve(__dirname, 'src'),
    'node_modules',
  ];
  return config;
}