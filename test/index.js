import transformCurrencyOperators from '../src';
import pluginTester from 'babel-plugin-tester';

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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
    },
    {
      skip: true,
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
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
      `
    },
    {
      skip: true,
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
      `
    },
    {
      skip: true,
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
      `
    },
    {
      skip: true,
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
      `
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
      `
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
      `
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
      `
    }
  ]
});
