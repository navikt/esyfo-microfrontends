import { existsSync, globSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const candidateGroups = {
  esbuild: {
    exact: [
      "node_modules/@esbuild",
      "node_modules/esbuild",
      "node_modules/.bin/esbuild",
      "node_modules/.pnpm/node_modules/@esbuild",
      "node_modules/.pnpm/node_modules/esbuild",
    ],
    globs: ["node_modules/.pnpm/@esbuild+*", "node_modules/.pnpm/esbuild@*"],
  },
  lefthook: {
    exact: ["node_modules/lefthook", "node_modules/.bin/lefthook"],
    globs: [
      "node_modules/.pnpm/lefthook*",
      "node_modules/.pnpm/node_modules/lefthook*",
    ],
  },
};

const rootDir = resolve(process.argv[2] ?? process.cwd());
process.chdir(rootDir);

function collectCandidates({ exact, globs }) {
  return new Set([
    ...exact.filter((candidate) => existsSync(candidate)),
    ...globs.flatMap((pattern) => globSync(pattern)),
  ]);
}

const matchesByGroup = Object.fromEntries(
  Object.entries(candidateGroups).map(([group, patterns]) => [
    group,
    collectCandidates(patterns),
  ]),
);

const missingGroups = Object.entries(matchesByGroup)
  .filter(([, matches]) => matches.size === 0)
  .map(([group]) => group);

if (missingGroups.length > 0) {
  throw new Error(
    `Expected sanitize candidates for ${missingGroups.join(
      " and ",
    )} in ${rootDir}, but found none. Refusing silent no-op.`,
  );
}

const allCandidates = [
  ...new Set(Object.values(matchesByGroup).flatMap((matches) => [...matches])),
].sort();

for (const candidate of allCandidates) {
  rmSync(candidate, { recursive: true, force: true });
}

console.log(
  `Removed ${allCandidates.length} paths (${matchesByGroup.esbuild.size} esbuild, ${matchesByGroup.lefthook.size} lefthook) from ${rootDir}`,
);
