/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  overrides: [{ files: '.nvmrc', options: { parser: 'yaml' } }],
  plugins: [
    'prettier-plugin-curly',
    'prettier-plugin-packagejson',
    'prettier-plugin-sentences-per-line',
    'prettier-plugin-sh',
  ],
  singleQuote: true,
};
export default config;
