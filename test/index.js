import transformCurrencyOperators from '../src';
import pluginTester from 'babel-plugin-tester';
import path from 'path';

pluginTester({
  plugin: transformCurrencyOperators,
  pluginName: 'transform-currency-operators',
  tests: [
    {
      title: 'dynamically named import transform',
      code: `
        import any from 'currency.js';
        any(1.23) + 4.56;
      `,
      output: `
        import any from 'currency.js';
        any(1.23).add(4.56);
      `,
    },
    {
      title: 'require transform',
      code: `
        var currency = require('currency.js');
        currency(1.23) + 4.56;
      `,
      output: `
        var currency = require('currency.js');
        currency(1.23).add(4.56);
      `,
    },
    {
      title: 'add transform',
      code: `
        import currency from 'currency.js';
        currency(1.23) + 4.56;
      `,
      output: `
        import currency from 'currency.js';
        currency(1.23).add(4.56);
      `,
    },
    {
      title: 'subtract transform',
      code: `
        import currency from 'currency.js';
        currency(1.23) - 4.56;
      `,
      output: `
        import currency from 'currency.js';
        currency(1.23).subtract(4.56);
      `,
    },
    {
      title: 'multiply transform',
      code: `
        import currency from 'currency.js';
        currency(1.23) * 4.56;
      `,
      output: `
        import currency from 'currency.js';
        currency(1.23).multiply(4.56);
      `,
    },
    {
      title: 'divide transform',
      code: `
        import currency from 'currency.js';
        currency(1.23) / 4.56;
      `,
      output: `
        import currency from 'currency.js';
        currency(1.23).divide(4.56);
      `,
    },
    {
      title: 'transforms multiple binary expressions',
      code: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        var c = a + b + 7.89;
      `,
      output: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        var c = a.add(b).add(7.89);
      `,
    },
    {
      title: 'compare currencies different from transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) != currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value != currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies less than transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) < currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value < currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies greater than transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) > currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value > currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies less than or equal transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) <= currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value <= currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies greater than or equal transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) >= currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value >= currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies equals transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) == currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value == currency(4.56).value) {}
      `,
    },
    {
      title: 'compare currencies strict equals transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) === currency(4.56)) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value === currency(4.56).value) {}
      `,
    },
    {
      title: 'compare mixed less than transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) < 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value < 4.56) {}
      `,
    },
    {
      title: 'compare mixed greater than transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) > 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value > 4.56) {}
      `,
    },
    {
      title: 'compare mixed less than or equal transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) <= 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value <= 4.56) {}
      `,
    },
    {
      title: 'compare mixed greater than or equal transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) >= 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value >= 4.56) {}
      `,
    },
    {
      title: 'compare mixed equals transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) == 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value == 4.56) {}
      `,
    },
    {
      title: 'compare mixed strict equals transform',
      code: `
        import currency from 'currency.js';
        if (currency(1.23) === 4.56) {}
      `,
      output: `
        import currency from 'currency.js';
        if (currency(1.23).value === 4.56) {}
      `,
    },
    {
      title: 'recognizes currency variables in arithmetic',
      code: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        var c = a + b;
      `,
      output: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        var c = a.add(b);
      `,
    },
    {
      title: 'recognizes currency variable assignment',
      code: `
        import currency from 'currency.js';
        var a = 1;
        a = currency(1.23);
        var b = a + 1;
      `,
      output: `
        import currency from 'currency.js';
        var a = 1;
        a = currency(1.23);
        var b = a.add(1);
      `,
    },
    {
      title: 'ignores currency variable reassignment',
      code: `
        import currency from 'currency.js';
        var a = currency(1.23);
        a = 1;
        var b = a + 1;
      `,
      output: `
        import currency from 'currency.js';
        var a = currency(1.23);
        a = 1;
        var b = a + 1;
      `,
    },
    {
      title: 'recognizes currency variables in comparison',
      code: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        if (a < b) {};
      `,
      output: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        if (a.value < b.value) {};
      `,
    },
    {
      title: 'ignores unknown identifiers for arithmetic operators',
      code: `
        import currency from 'currency.js';
        var a = 1;
        var b = currency(4.56);
        var c = a + b;
      `,
      output: `
        import currency from 'currency.js';
        var a = 1;
        var b = currency(4.56);
        var c = a + b;
      `,
    },
    {
      title: 'ignores unknown identifiers for compare operators',
      code: `
        import currency from 'currency.js';
        var a = 1;
        var b = currency(4.56);
        if (a < b) {}
      `,
      output: `
        import currency from 'currency.js';
        var a = 1;
        var b = currency(4.56);
        if (a < b) {}
      `,
    },
    {
      title: 'transforms variables in nested scopes',
      code: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        if (true) {
          var c = a + b;
        }
      `,
      output: `
        import currency from 'currency.js';
        var a = currency(1.23);
        var b = currency(4.56);
        if (true) {
          var c = a.add(b);
        }
      `,
    },
    {
      title: 'transforms currency arrow function factories',
      code: `
        import currency from 'currency.js';
        var a = value => currency(value, {});
        var b = a(1.23) + 4.56;
      `,
      output: `
        import currency from 'currency.js';
        var a = value => currency(value, {});
        var b = a(1.23).add(4.56);
      `,
    },
    {
      title: 'transforms currency arrow block function factories',
      code: `
        import currency from 'currency.js';
        var a = value => { return currency(value, {}); };
        var b = a(1.23) + 4.56;
      `,
      output: `
        import currency from 'currency.js';
        var a = value => {
          return currency(value, {});
        };
        var b = a(1.23).add(4.56);
      `,
    },
    {
      title: 'transforms currency function factories',
      code: `
        import currency from 'currency.js';
        function foo(value) { return currency(1.23, {}); }
        var a = foo + 4.56;
      `,
      output: `
        import currency from 'currency.js';
        function foo(value) {
          return currency(1.23, {});
        }
        var a = foo.add(4.56);
      `,
    },
    {
      title: 'transforms currency function variable factories',
      code: `
        import currency from 'currency.js';
        var a = function (value) { return currency(1.23, {}); }
        var b = a + 4.56;
      `,
      output: `
        import currency from 'currency.js';
        var a = function (value) {
          return currency(1.23, {});
        };
        var b = a.add(4.56);
      `,
    },
    {
      title: 'ignores currencies out of scope',
      code: `
        import currency from 'currency.js';
        if (true) { let a = currency(1.23); }
        let a = 1;
        var b = a + 2;
      `,
      output: `
        import currency from 'currency.js';
        if (true) {
          let a = currency(1.23);
        }
        let a = 1;
        var b = a + 2;
      `,
    },
    {
      title: 'allows methods to be called with wrapped currencies',
      code: `
        import currency from 'currency.js';
        let a = (currency(1.23) + 4.56).format();
      `,
      output: `
        import currency from 'currency.js';
        let a = currency(1.23).add(4.56).format();
      `,
    },
    {
      title: 'transform allows custom import currencies',
      pluginOptions: ['./test/fixtures/currencies/currencyWithDefaults'],
      fixture: path.join(__dirname, 'fixtures/testImportCurrency.js'),
      output: `
        import exportedCurrency from './currencies/currencyWithDefaults';
        let a = exportedCurrency(1.23).add(4.56);
      `,
    },
    {
      title: 'transform allows custom require currencies',
      pluginOptions: ['./test/fixtures/currencies/currencyWithDefaults'],
      fixture: path.join(__dirname, 'fixtures/testRequireCurrency.js'),
      output: `
        var exportedCurrency = require('./currencies/currencyWithDefaults');
        let a = exportedCurrency(1.23).add(4.56);
      `,
    },
  ],
});
