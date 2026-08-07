import { execFileSync } from 'node:child_process';

import { plugin } from '../src/plugin.ts';

const owner = 'michaelfaith';
const repository = 'eslint-plugin-package-json';
const parentIssueNumber = 655;
const issueTitlePrefix = '🏗️ Refactor:';
const markerPrefix = '<!-- rule-migration:';

interface ExistingIssue {
  number: number;
  state: string;
  title: string;
}

function runGh(args: string[]): string {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
  }).trim();
}

function getExistingIssues(): ExistingIssue[] {
  return JSON.parse(
    runGh([
      'issue',
      'list',
      '--repo',
      `${owner}/${repository}`,
      '--state',
      'all',
      '--limit',
      '1000',
      '--json',
      'number,state,title',
    ]),
  ) as ExistingIssue[];
}

function getTitle(name: string): string {
  return `${issueTitlePrefix} Migrate \`${name}\` to \`@eslint/json\` API`;
}

function getBody(name: string): string {
  const rule = plugin.rules[name];
  const documentationUrl = rule.meta.docs?.url;

  return [
    `${markerPrefix}${name} -->`,
    '',
    `Migrate the \`${name}\` rule from the \`jsonc-eslint-parser\` API to the \`@eslint/json\` language API.`,
    '',
    "- Preserve the rule's current behavior and tests.",
    '- Update AST visitors and node types using the [migration research](https://github.com/michaelfaith/eslint-plugin-package-json/blob/main/docs/plans/parser-to-language-migration/research.md#rule-authoring-comparison).',
    documentationUrl ? `- Rule documentation: ${documentationUrl}` : undefined,
    '',
    'Parent: #655',
  ]
    .filter((line): line is string => line !== undefined)
    .join('\n');
}

function createIssue(name: string): number {
  const output = runGh([
    'issue',
    'create',
    '--repo',
    `${owner}/${repository}`,
    '--title',
    getTitle(name),
    '--body',
    getBody(name),
    '--label',
    'status: accepting prs',
    '--label',
    'type: feature',
  ]);
  const match = /\/issues\/(\d+)$/.exec(output);

  if (!match) {
    throw new Error(
      `Could not determine the issue number from gh output: ${output}`,
    );
  }

  return Number(match[1]);
}

function addAsSubIssue(issueNumber: number): void {
  runGh([
    'api',
    '--method',
    'POST',
    `repos/${owner}/${repository}/issues/${String(parentIssueNumber)}/sub_issues`,
    '--field',
    `sub_issue_id=${String(issueNumber)}`,
  ]);
}

const main = () => {
  const shouldCreate = process.argv.includes('--create');
  const existingTitles = new Set(getExistingIssues().map(({ title }) => title));
  const ruleNames = Object.keys(plugin.rules).sort();
  const pendingRules = ruleNames.filter(
    (name) => !existingTitles.has(getTitle(name)),
  );

  console.log(
    `${shouldCreate ? 'Creating' : 'Would create'} ${String(pendingRules.length)} of ${String(ruleNames.length)} rule migration issues.`,
  );

  for (const name of pendingRules) {
    const title = getTitle(name);

    if (!shouldCreate) {
      console.log(`- ${title}`);
      continue;
    }

    const issueNumber = createIssue(name);
    addAsSubIssue(issueNumber);
    console.log(`Created #${String(issueNumber)}: ${title}`);
  }

  if (!shouldCreate) {
    console.log(
      'Dry run only. Re-run with --create to create and link these issues.',
    );
  }
};

main();
