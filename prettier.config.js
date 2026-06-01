/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  importOrder: ['<BUILTIN_MODULES>', '', '<THIRD_PARTY_MODULES>', '', '^[.]'],
  importOrderTypeScriptVersion: '6.0.0',
  overrides: [{ files: '.nvmrc', options: { parser: 'yaml' } }],
  plugins: [
    'prettier-plugin-curly',
    'prettier-plugin-packagejson',
    'prettier-plugin-sh',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  singleQuote: true,
};
export default config;
