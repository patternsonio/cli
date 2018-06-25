import * as path from 'path';
import * as fs from 'fs';

export default function virtualFileSystem(
  vComponentsRgx,
  componentsDir,
  nodeModulesDir,
) {
  const files = {};

  return {
    state: files,
    readdir(dirname) {
      if (vComponentsRgx.test(dirname)) {
        return new Promise((resolve, reject) => {
          fs.readdir(
            dirname.replace(vComponentsRgx, componentsDir),
            (err, f) => {
              return err ? reject(err) : resolve(f);
            },
          );
        });
      }

      return Promise.resolve(
        Object.keys(files)
          .filter((dirEntry) => {
            return dirEntry.indexOf(dirname) === 0;
          })
          .map((dirEntry) => {
            return dirEntry.replace(`${dirname}${path.sep}`, '');
          })
          .filter((dirEntry) => {
            return dirEntry.indexOf(path.sep) === -1;
          }),
      );
    },
    mkdirSync(dirPath) {
      if (files[dirPath]) {
        throw new Error(`mkdir, dir already exists: ${dirPath}`);
      }

      files[dirPath] = {
        isDirectory: true,
        isFile: false,
      };
    },
    mkdir(dirPath) {
      try {
        return Promise.resolve(this.mkdirSync(dirPath));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    statSync(entry) {
      let result = null;

      if (vComponentsRgx.test(entry)) {
        try {
          result = fs.statSync(entry.replace(vComponentsRgx, componentsDir));
        } catch (e) {
          /* noop */
        }
      } else if (entry.indexOf(nodeModulesDir) === 0) {
        try {
          result = fs.statSync(entry);
        } catch (e) {
          /* noop */
        }
      } else if (files[entry]) {
        result = {
          isDirectory() {
            return files[entry].isDirectory;
          },
          isFile() {
            return !files[entry].isDirectory;
          },
        };
      }

      if (!result) {
        throw new Error(`ENOENT: no such file or directory, stat ${entry}`);
      }

      return result;
    },
    stat(entry) {
      try {
        return Promise.resolve(this.statSync(entry));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    readFileSync(file) {
      if (files[file] && !files[file].isDirectory) {
        return files[file].content.toString();
      } else if (vComponentsRgx.test(file)) {
        return fs
          .readFileSync(file.replace(vComponentsRgx, componentsDir))
          .toString();
      } else if (file.indexOf(nodeModulesDir) === 0) {
        return fs.readFileSync(file).toString();
      }

      throw new Error(`ENOENT: no such file or directory ${file}`);
    },
    readFile(file) {
      try {
        return Promise.resolve(this.readFileSync(file, 'utf-8', true));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    writeFileSync(name, content) {
      files[name] = {
        isDirectory: false,
        isFile: true,
        content,
      };
    },
    writeFile(name, content) {
      try {
        return Promise.resolve(this.writeFileSync(name, content));
      } catch (e) {
        return Promise.reject(e);
      }
    },
  };
}
