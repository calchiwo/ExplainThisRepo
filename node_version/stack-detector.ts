import type { RepoLanguageMap } from "./github.js";

type TreeItem = { path: string; type: string; size?: number };

type StackInput = {
  languages: RepoLanguageMap;
  tree: TreeItem[];
  keyFiles: Record<string, string>;
};

export type StackReport = {
  languages: string[];
  runtimes: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tooling: string[];
  infra: string[];
  packageManagers: string[];
};

export function detectStack(input: StackInput): StackReport {
  const report: StackReport = {
    languages: [],
    runtimes: [],
    frontend: [],
    backend: [],
    databases: [],
    tooling: [],
    infra: [],
    packageManagers: [],
  };

  // Languages
  const total = Object.values(input.languages).reduce((a, b) => a + b, 0);
  report.languages = Object.entries(input.languages)
    .filter(([_, bytes]) => bytes / total > 0.03)
    .map(([lang]) => lang);

  // Infra (tree)
  const paths = input.tree.map(t => t.path.toLowerCase());
  if (paths.includes("dockerfile")) report.infra.push("Docker");
  if (paths.includes("vercel.json")) report.infra.push("Vercel");
  if (paths.includes("netlify.toml")) report.infra.push("Netlify");
  if (paths.some(p => p.startsWith(".github/workflows"))) report.infra.push("GitHub Actions");

  // Package.json detection
  const pkgRaw = input.keyFiles["package.json"];
  if (pkgRaw) {
    report.runtimes.push("Node.js");
    report.packageManagers.push("npm");

    try {
      const pkg = JSON.parse(pkgRaw);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.react) report.frontend.push("React");
      if (deps.next) report.frontend.push("Next.js");
      if (deps.express) report.backend.push("Express");
      if (deps.fastify) report.backend.push("Fastify");
      if (deps.prisma) report.databases.push("Prisma");
      if (deps.mongoose) report.databases.push("MongoDB");
      if (deps.jest) report.tooling.push("Jest");
      if (deps.vite) report.tooling.push("Vite");
      if (deps.eslint) report.tooling.push("ESLint");
    } catch {}
  }

  return report;
}