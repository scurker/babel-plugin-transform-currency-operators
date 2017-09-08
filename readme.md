# babel-plugin-transform-currency-operators [![Build Status](https://travis-ci.org/scurker/babel-plugin-transform-currency-operators.svg?branch=master)](https://travis-ci.org/scurker/babel-plugin-transform-currency-operators) [![Coverage Status](https://coveralls.io/repos/scurker/babel-plugin-transform-currency-operators/badge.svg?branch=test-coverage&service=github)](https://coveralls.io/github/scurker/babel-plugin-transform-currency-operators?branch=test-coverage) [![npm](https://img.shields.io/npm/v/babel-plugin-transform-currency-operators.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-transform-currency-operators)

> An experimental babel plugin for transforming [currency.js](https://github.com/scurker/currency.js) operators.

## Example

**In**

```javascript
import currency from 'currency.js';

var currency1 = currency(1.23);
var currency2 = currency1 + 4.56;
var currency3 = currency2 - 4.56;
var currency4 = currency3 * 2;
var currency5 = currency4 / 4;
```

**Out**

```javascript
import currency from 'currency.js';

var currency1 = currency(1.23);
var currency2 = currency1.add(4.56);
var currency3 = currency2.subtract(4.56);
var currency4 = currency3.multiply(2);
var currency5 = currency4.divide(4);
```

## Installation

With [npm](https://www.npmjs.com/):

```sh
npm install --save-dev babel-plugin-transform-currency-operators
```

With [yarn](https://yarnpkg.com):

```sh
yarn install babel-plugin-transform-currency-operators --dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-currency-operators"]
}
```

### Via CLI

```sh
babel --plugins transform-currency-operators
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-currency-operators"]
});
```

## License

[MIT](/license)