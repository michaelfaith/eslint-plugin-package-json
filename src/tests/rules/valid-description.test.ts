import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-description', rules['valid-description'], {
  invalid: [
    {
      code: `{ "description": null }`,
      errors: [
        {
          message:
            'Invalid description: the value is `null`, but should be a `string`',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": 123 }`,
      errors: [
        {
          message:
            'Invalid description: the type should be a `string`, not `number`',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": true }`,
      errors: [
        {
          message:
            'Invalid description: the type should be a `string`, not `boolean`',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": [] }`,
      errors: [
        {
          message:
            'Invalid description: the type should be a `string`, not `Array`',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": "" }`,
      errors: [
        {
          message:
            'Invalid description: the value is empty, but should be a description',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": "   " }`,
      errors: [
        {
          message:
            'Invalid description: the value is empty, but should be a description',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{ "description": {} }`,
      errors: [
        {
          message:
            'Invalid description: the type should be a `string`, not `object`',
        },
      ],
      filename: 'package.json',
    },
  ],

  valid: [
    {
      code: `{}`,
      filename: 'package.json',
    },
    {
      code: `{ "description": "The Fragile" }`,
      filename: 'package.json',
    },
  ],
});
