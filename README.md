# safe-umd-webpack-plugin

Webpack plugin to handle optional dependencies safely when using 'libraryTarget: umd'.

## Usecase

When using `umd` as a libraryTarget with config like :

```js
module.exports = {
  entry: './src/index.js',
  output: {
    library: ['my', 'module'],
    libraryTarget: 'umd',
    filename: 'bundle.js'
  },
  externals: {
    'my-ext-module': {
      commonjs: 'my-ext-module',
      commonjs2: 'my-ext-module',
      amd: 'my-ext-module',
      root: ['my', 'ext', 'module']
    }
  }
}; 
```

You can't use optional dependencies for a root (namespace) because of the generated code like :

```js
root["my"] = root["my"] || {}, root["my"]["module"] = factory(root["my"]["ext"]["module"]);
```

This plugin replace this code to safely access the namespace with code like :

```js
root["my"] = root["my"] || {}, root["my"]["module"] = factory(root["my"] && root["my"]["ext"] && root["my"]["ext"]["module"]);
```

## Install

```
npm install safe-umd-webpack-plugin --save-dev
```

## Config

`webpack.config.js`

```js
var SafeUmdPlugin = require('safe-umd-webpack-plugin');

// ...

module.exports = {
  // ...
  plugins: [
    //...
    new SafeUmdPlugin()
  ]
}
```


