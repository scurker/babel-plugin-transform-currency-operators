import transformCurrencyOperators from '../src';
import pluginTester from 'babel-plugin-tester';

pluginTester({
  plugin: transformCurrencyOperators,
  pluginName: 'transform-currency-operators',
  tests: [
    {
      title: 'add transform',
      code: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a + 4.56;
      `,
      output: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a.add(4.56);
      `
    },
    {
      title: 'subtract transform',
      code: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a - 4.56;
      `,
      output: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a.subtract(4.56);
      `
    },
    {
      title: 'multiply transform',
      code: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a * 4.56;
      `,
      output: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a.multiply(4.56);
      `
    },
    {
      title: 'divide transform',
      code: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a / 4.56;
      `,
      output: `
        import currency from 'currency.js';

        var a = currency(1.23);
        var b = a.divide(4.56);
      `
    }
  ]
});
