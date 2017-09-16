# babel-plugin-transform-currency-operators [![Build Status](https://travis-ci.org/scurker/babel-plugin-transform-currency-operators.svg?branch=master)](https://travis-ci.org/scurker/babel-plugin-transform-currency-operators) [![Coverage Status](https://coveralls.io/repos/github/scurker/babel-plugin-transform-currency-operators/badge.svg?branch=master)](https://coveralls.io/github/scurker/babel-plugin-transform-currency-operators?branch=master) [![npm](https://img.shields.io/npm/v/babel-plugin-transform-currency-operators.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-transform-currency-operators)

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
var currency6 = currency1 + currency2;

var MultiDecimal = value => currency(value, { decimals: 3 });
var currency7 = MultiDecimal(1.234) + 5.678;

if(currency1 < currency2) { ... }
if(currency1 > currency2) { ... }
if(currency1 === 1.23) { ... }
```

**Out**

```javascript
import currency from 'currency.js';

var currency1 = currency(1.23);
var currency2 = currency1.add(4.56);
var currency3 = currency2.subtract(4.56);
var currency4 = currency3.multiply(2);
var currency5 = currency4.divide(4);
var currency6 = currency1.add(currency2);

var MultiDecimal = value => currency(value, { decimals: 3 });
var currency7 = MultiDecimal(1.234).add(5.678);

if(currency1.value < currency2.value) { ... }
if(currency1.value > currency2.value) { ... }
if(currency1.value === 1.23) { ... }
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

## Advanced Usage

If you have a need to customize and export currency settings as a module, you can include the path to your currency (relative from the root of your project) in your `.babelrc` plugin configuration to transform those imported module's operator along with any `currency.js` imports:

> File in your project: `path/to/custom/currency.js`

```javascript
import currency from 'currency.js';

export default function myCustomCurrencyDefaults(value) {
  return currency(value, { symbol: '€', ...otherOptions });
}
```

### `.babelrc`

```javascript
{
  "plugins": ["transform-currency-operators", ['./path/to/custom/currency']]
}
```

## License

[MIT](/license)