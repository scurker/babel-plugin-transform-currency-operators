import { readFileSync } from 'fs';
import babel from 'rollup-plugin-babel';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  output: {
    format: 'cjs',
    file: pkg.main
  }
};