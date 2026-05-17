import { rule } from '../../rules/no-redundant-publishConfig.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('no-redundant-publishConfig', rule, {
  invalid: [
    {
      code: `{
	"name": "my-package",
	"publishConfig": { "access": "public" }
}`,
      errors: [
        {
          line: 3,
          messageId: 'redundantAccess',
          suggestions: [
            {
              messageId: 'removeAccess',
              output: `{
	"name": "my-package",
	"publishConfig": {  }
}`,
            },
          ],
        },
      ],
    },
    {
      code: `{
	"name": "my-package",
	"publishConfig": { "access": "restricted" }
}`,
      errors: [
        {
          line: 3,
          messageId: 'redundantAccess',
          suggestions: [
            {
              messageId: 'removeAccess',
              output: `{
	"name": "my-package",
	"publishConfig": {  }
}`,
            },
          ],
        },
      ],
    },
    {
      code: `{
	"name": "my-package",
	"publishConfig": {
		"access": "public",
		"registry": "https://example.com"
	}
}`,
      errors: [
        {
          line: 4,
          messageId: 'redundantAccess',
          suggestions: [
            {
              messageId: 'removeAccess',
              output: `{
	"name": "my-package",
	"publishConfig": {
		
		"registry": "https://example.com"
	}
}`,
            },
          ],
        },
      ],
    },
    {
      code: `{
	"name": "test",
	"version": "1.0.0",
	"publishConfig": {
		"access": "public"
	}
}`,
      errors: [
        {
          line: 5,
          messageId: 'redundantAccess',
          suggestions: [
            {
              messageId: 'removeAccess',
              output: `{
	"name": "test",
	"version": "1.0.0",
	"publishConfig": {
		
	}
}`,
            },
          ],
        },
      ],
    },
  ],
  valid: [
    `{
	"name": "@myorg/my-package",
	"publishConfig": { "access": "public" }
}`,
    `{
	"name": "@myorg/my-package",
	"publishConfig": { "access": "restricted" }
}`,
    `{
	"name": "my-package"
}`,
    `{
	"name": "my-package",
	"publishConfig": {
		"registry": "https://example.com"
	}
}`,
    `{
	"publishConfig": { "access": "public" }
}`,
    `{
	"name": "@myorg/my-package",
	"publishConfig": {
		"access": "public",
		"registry": "https://example.com"
	}
}`,
    `{
	"name": "my-package",
	"publishConfig": "invalid"
}`,
    `{
	"name": "@org/scope/package",
	"publishConfig": { "access": "restricted" }
}`,
    `{
	"name": 123,
	"publishConfig": { "access": "public" }
}`,
  ],
});
