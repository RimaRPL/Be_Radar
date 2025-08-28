import path from "path";

export function getPopplerPath() {
  return path.resolve(process.cwd(), "poppler/bin/pdftoppm.exe");
}
