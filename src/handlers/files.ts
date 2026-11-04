import path from "node:path";

const glob = new Bun.Glob("**/*.{ts,js}");

export async function getFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    for await (const file of glob.scan({ cwd: dir, absolute: true })) {
      if (!file.endsWith(".d.ts")) files.push(file);
    }
  } catch {
    return [];
  }
  return files.sort();
}

export async function getDirectories(dir: string): Promise<string[]> {
  const dirs = new Set<string>();
  for await (const entry of new Bun.Glob("*/**").scan({ cwd: dir, onlyFiles: true })) {
    dirs.add(entry.split(/[\\/]/)[0]!);
  }
  return [...dirs].sort().map((name) => path.join(dir, name));
}
