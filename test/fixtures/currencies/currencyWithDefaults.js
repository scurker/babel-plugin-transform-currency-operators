import currency from 'currency.js';

export default function currencyWithDefaults(value) {
  return currency(value, { decimals: 3 });
}
