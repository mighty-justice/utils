import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json';

const name = 'utils'
  , input = 'src/index.ts'
  , extensions = ['.js', '.jsx', '.ts', '.tsx']
  , babelConfig = {
    ...babelrc({ addExternalHelpersPlugin: false }),
    exclude: 'node_modules/**',
    extensions,
  }
  , plugins = [
    peerDepsExternal(),
    resolve({ extensions }),
    json(),
    babel(babelConfig),
    commonjs(),
  ]
  ;

export default [
  // browser-friendly UMD build
  {
    input,
    output: { file: pkg.browser, format: 'umd', name },
    plugins,
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    external: ['ms'],
    plugins,
  },
];
