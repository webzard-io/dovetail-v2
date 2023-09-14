const path = require('path');

module.exports = {
  require: [
    '@cloudtower/eagle/dist/style.css',
    'antd/dist/antd.css'
  ],
  propsParser: (filePath, source, resolver, handlers) => {
    const { ext } = path.parse(filePath);
    return ext === '.tsx'
      ? require('react-docgen-typescript').parse(filePath, source, resolver, handlers)
      : require('react-docgen').parse(source, resolver, handlers);
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
      ]
    }
  }
};
