import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

const bundle = (input, filename, options = {}) => ({
  input,
  output: {
    file: filename,
    format: 'umd',
    name: 'graphologyLibrary',
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    resolve({preferBuiltins: true}),
    builtins(),
    commonjs(),
    ...(options.minimize ? [terser()] : [])
  ]
});

export default [
  bundle(pkg.browser, './dist/graphology-library.js'),
  bundle(pkg.browser, './dist/graphology-library.min.js', {minimize: true})
];
