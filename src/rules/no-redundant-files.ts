import type { Rule } from "eslint";
import type { AST as JsonAST } from "jsonc-eslint-parser";
import type { JSONStringLiteral } from "jsonc-eslint-parser/lib/parser/ast.js";

import * as ESTree from "estree";

import { createRule } from "../createRule.js";
import { isJSONStringLiteral, isNotNullish } from "../utils/predicates.js";

const defaultFiles = [
	/* cspell:disable-next-line */
	"LICENCE",
	/* cspell:disable-next-line */
	"LICENCE.md",
	"LICENSE",
	"LICENSE.md",
	"package.json",
	"README.md",
] as const;

const cachedRegex = new Map<string, RegExp>();
const getCachedLocalFileRegex = (filename: string) => {
	// Strip the leading `./`, if there is one, since we'll be incorporating
	// it into the regex.
	const baseFilename = filename.replace("./", "");
	let regex = cachedRegex.get(baseFilename);
	if (regex) {
		return regex;
	} else {
		regex = new RegExp(`^(./)?${baseFilename}$`, "i");
		cachedRegex.set(baseFilename, regex);
		return regex;
	}
};

/**
 * A function to use as a fix, that will remove an element from an array of elements
 * and manage the removal of any commas that would be necessary to maintain proper
 * json.  If this is the last entry, and we don't have a comma (strict json), then
 * we don't need to worry about removing this element's comma, but we should remove
 * the comma from the element before, since it will the last element after the removal.
 * If this is not the last line, and it's not the only line (which wouldn't have a comma)
 * then we need to remove the comma from this line, so that it's not left behind after
 * the node removal.
 * @param elements All file entry elements
 * @param currentIndex The index of the entry that we want to remove
 * @param fixer The eslint fixer function we'll use to remove the entry
 * @param context Current context
 * @returns The list of fixes that the `context.report` fix needs to perform the removals for us
 */
const removeEntryAndAppropriateCommas = (
	elements: JsonAST.JSONStringLiteral[],
	currentIndex: number,
	fixer: Rule.RuleFixer,
	context: Rule.RuleContext,
): Rule.Fix[] => {
	const element = elements[currentIndex];
	const fixes = [fixer.remove(element as unknown as ESTree.Node)];

	// If this is not the last entry, then we need to remove the comma from this line.
	// Or if it's jsonc, then we may need to remove the comma, even if it is the last line
	const commaTokenFromCurrentLine =
		context.sourceCode.getTokenAfter(element as unknown as ESTree.Node)
			?.value === ","
			? context.sourceCode.getTokenAfter(
					element as unknown as ESTree.Node,
				)
			: null;
	if (commaTokenFromCurrentLine) {
		fixes.push(fixer.remove(commaTokenFromCurrentLine));
	}

	// If this is the last line and it's not the only entry, then the line above this one
	// will become the last line, and should not have a trailing comma.
	if (currentIndex > 0) {
		const commaTokenFromPreviousLine =
			context.sourceCode.getTokenAfter(
				elements[currentIndex - 1] as unknown as ESTree.Node,
			)?.value === ","
				? context.sourceCode.getTokenAfter(
						elements[currentIndex - 1] as unknown as ESTree.Node,
					)
				: null;
		if (!commaTokenFromCurrentLine && commaTokenFromPreviousLine) {
			fixes.push(fixer.remove(commaTokenFromPreviousLine));
		}
	}

	return fixes;
};

export const rule = createRule({
	create(context) {
		// We need to cache these as we find them, since we need to know some of
		// the other values to ensure that files doesn't contain duplicates.
		const entryCache: {
			bin: string[];
			files: JSONStringLiteral[];
			main?: string;
		} = { bin: [], files: [] };

		return {
			"Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=bin]"(
				node: JsonAST.JSONProperty,
			) {
				const binValue = node.value;

				// "bin" can be either a simple string or a map of commands to files.
				// If it's anything else, then this is malformed and we can't really
				// do anything with it.
				if (isJSONStringLiteral(binValue)) {
					entryCache.bin.push(binValue.value);
				} else if (binValue.type === "JSONObjectExpression") {
					for (const prop of binValue.properties) {
						if (isJSONStringLiteral(prop.value)) {
							entryCache.bin.push(prop.value.value);
						}
					}
				}
			},
			"Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=files]"(
				node: JsonAST.JSONProperty,
			) {
				// "files" should only ever be an array of strings.
				if (node.value.type === "JSONArrayExpression") {
					// We want to add it to the files cache, but also check for
					// duplicates as we go.
					const seen = new Set<string>();
					const elements = node.value.elements
						.filter(isNotNullish)
						.filter(isJSONStringLiteral);
					for (const [index, element] of elements.entries()) {
						if (seen.has(element.value)) {
							context.report({
								data: { file: element.value },
								messageId: "duplicate",
								node: element as unknown as ESTree.Node,
								suggest: [
									{
										fix: (fixer) =>
											removeEntryAndAppropriateCommas(
												elements,
												index,
												fixer,
												context,
											),
										messageId: "remove",
									},
								],
							});
						} else {
							seen.add(element.value);
							entryCache.files.push(element);
						}

						// We can also go ahead and check if this matches one
						// of the static default files
						const regex = getCachedLocalFileRegex(element.value);
						for (const defaultFile of defaultFiles) {
							if (regex.test(defaultFile)) {
								context.report({
									data: { file: element.value },
									messageId: "unnecessaryDefault",
									node: element as unknown as ESTree.Node,
									suggest: [
										{
											fix: (fixer) =>
												removeEntryAndAppropriateCommas(
													elements,
													index,
													fixer,
													context,
												),
											messageId: "remove",
										},
									],
								});
							}
						}
					}
				}
			},
			"Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=main]"(
				node: JsonAST.JSONProperty,
			) {
				// "main" should only ever be a string.
				if (isJSONStringLiteral(node.value)) {
					entryCache.main = node.value.value;
				}
			},
			"Program:exit"() {
				// Now that we have all of the entries, we can check for unnecessary files.
				const files = entryCache.files;

				// Bail out early if there are no files.
				if (files.length === 0) {
					return;
				}

				// First check if the "main" entry is included in "files".
				if (entryCache.main) {
					for (const [index, fileEntry] of files.entries()) {
						const regex = getCachedLocalFileRegex(fileEntry.value);
						if (regex.test(entryCache.main)) {
							context.report({
								data: { file: fileEntry.value },
								messageId: "unnecessaryMain",
								node: fileEntry as unknown as ESTree.Node,
								suggest: [
									{
										fix: (fixer) =>
											removeEntryAndAppropriateCommas(
												files,
												index,
												fixer,
												context,
											),
										messageId: "remove",
									},
								],
							});
						}
					}
				}

				// Next check if any "bin" entries are included in "files".
				for (const binEntry of entryCache.bin) {
					for (const [index, fileEntry] of files.entries()) {
						const regex = getCachedLocalFileRegex(fileEntry.value);
						if (regex.test(binEntry)) {
							context.report({
								data: { file: fileEntry.value },
								messageId: "unnecessaryBin",
								node: fileEntry as unknown as ESTree.Node,
								suggest: [
									{
										fix: (fixer) =>
											removeEntryAndAppropriateCommas(
												files,
												index,
												fixer,
												context,
											),
										messageId: "remove",
									},
								],
							});
						}
					}
				}
			},
		};
	},

	meta: {
		docs: {
			category: "Best Practices",
			description: "Prevents adding unnecessary / redundant files.",
			recommended: false,
		},
		hasSuggestions: true,
		messages: {
			duplicate: 'Files has more than one entry for "{{file}}".',
			remove: "Remove this redundant entry.",
			unnecessaryBin: `Explicitly declaring "{{file}}" in "files" is unnecessary; it's included in "bin".`,
			unnecessaryDefault: `Explicitly declaring "{{file}}" in "files" is unnecessary; it's included by default.`,
			unnecessaryMain: `Explicitly declaring "{{file}}" in "files" is unnecessary; it's the "main" entry.`,
		},
		schema: [],
		type: "suggestion",
	},
});
