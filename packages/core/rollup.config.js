import babel from '@rollup/plugin-babel';

export default {
  input: 'src/halo.js',
  output: {
    file: 'dist/halo.js',
    format: 'cjs',
  },
  plugins: [babel({babelHelpers: 'bundled'})],
};
