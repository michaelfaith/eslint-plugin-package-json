import type * as ESTree from "estree";
import type {
  FromSchema as InferJsonSchemaType,
  JSONSchema,
} from "json-schema-to-ts";

import { AST, Rule, SourceCode } from "eslint";
import { AST as JsonAST, type RuleListener } from "jsonc-eslint-parser";

import { isPackageJson } from "./utils/isPackageJson.ts";

export type JsonAstBodyExpression = ESTree.Expression & {
  properties: JsonAstBodyProperty[];
};

export type JsonAstBodyProperty = JsonAST.JSONProperty & {
  value: string;
};

export interface JsonAstBodyStatement extends ESTree.ExpressionStatement {
  expression: JsonAstBodyExpression;
}

export interface PackageJsonAst extends AST.Program {
  body: [JsonAstBodyStatement];
}

export interface PackageJsonPluginSettings {
  /**
   * Whether `require-*` rules, if used, should enforce the presence of
   * the corresponding property *in package.json files with `"private": true`*.
   *
   * If not specified, it will not enforce the presence only of `name` and `version` properties.
   */
  enforceForPrivate?: boolean;
}

export interface PackageJsonRuleContext<Options extends unknown[] = unknown[]>
  extends Rule.RuleContext {
  options: Options;
  settings: {
    packageJson?: PackageJsonPluginSettings;
  };
  sourceCode: PackageJsonSourceCode;
}

export interface PackageJsonRuleModule<
  Options extends unknown[] = unknown[],
  Schema extends JSONSchema[] = JSONSchema[],
> {
  create(context: PackageJsonRuleContext<Options>): RuleListener;
  meta: Omit<Rule.RuleMetaData, "defaultOptions" | "docs" | "schema"> & {
    defaultOptions?: NoInfer<Options>;
    docs?: Rule.RuleMetaData["docs"] & {
      category?: string;
    };
    schema?: Schema;
  };
}

export interface PackageJsonSourceCode extends SourceCode {
  ast: PackageJsonAst;
}

type InferJsonSchemasTupleType<T extends JSONSchema[]> = {
  [K in keyof T]?: InferJsonSchemaType<T[K]>;
};

/**
 * Rule options type is inferred from the JSON schema by [json-schema-to-ts](https://www.npmjs.com/package/json-schema-to-ts).
 * If you're not satisfied with the inferred type, you may specify it manually in the first type parameter.
 */
export function createRule<
  OptionsOverride extends unknown[] = never,
  const Schema extends JSONSchema[] = JSONSchema[],
  // `[T] extends [never]` correctly checks if `T` is `never`, see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
  _OptionsResolved extends unknown[] = [OptionsOverride] extends [never]
    ? InferJsonSchemasTupleType<Schema>
    : OptionsOverride,
>(
  rule: PackageJsonRuleModule<_OptionsResolved, Schema> & { name: string },
): PackageJsonRuleModule<_OptionsResolved, Schema> {
  return {
    create(context) {
      if (!isPackageJson(context.filename)) {
        return {};
      }

      return rule.create(context);
    },
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url: `https://eslint-plugin-package-json.dev/rules/${rule.name}`,
      },
    },
  };
}
