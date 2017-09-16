import path from 'path';

const rootPath = process.cwd();

export default function resolveRelativePath(currentFile, importPath) {
  let absolutePath = path.resolve(rootPath, importPath),
    relativePathToImport = path.relative(
      path.dirname(currentFile),
      absolutePath
    );

  // Check to see if path is relative to currentFile's folder
  if (relativePathToImport.indexOf('../') !== 0) {
    relativePathToImport = `./${relativePathToImport}`;
  }

  return relativePathToImport;
}
