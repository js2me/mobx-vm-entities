/* eslint-disable @typescript-eslint/no-unused-vars */
import { execSync } from 'child_process';
import fs, { lstatSync } from 'fs';
import path from 'path';

//#region утилиты
const $ = (cmd) => execSync(cmd, { stdio: 'inherit' });
const scanDir = (dir) => fs.readdirSync(dir);
const readFile = (file) => fs.readFileSync(file);
const writeFile = (file, content) => fs.writeFileSync(file, content);
//#endregion

$(`cp -r LICENSE dist`);

const exportsConfig = {
  './package.json': './package.json',
};

const deepScan = (p) => {
  let targetPath = p;

  const pathstat = lstatSync(p);

  if (pathstat.isDirectory()) {
    const subdirs = scanDir(p);
    subdirs.forEach((subdir) => {
      deepScan(`${p}/${subdir}`);
    });
  } else {
    const ext = path.extname(targetPath);

    const fixedPath = targetPath.replace(ext, '').replace('src/', '');

    if (ext === '.ts' || ext === '.tsx') {
      if (fixedPath === 'index') {
        exportsConfig[`.`] = {
          import: `./${fixedPath}.js`,
          types: `./${fixedPath}.d.ts`,
        };
      } else if (fixedPath.endsWith('/index')) {
        exportsConfig[`${fixedPath.split('/').slice(0, -1).join('/')}`] = {
          import: `./${fixedPath}.js`,
          types: `./${fixedPath}.d.ts`,
        };
      } else {
        exportsConfig[`${fixedPath}`] = {
          import: `./${fixedPath}.js`,
          types: `./${fixedPath}.d.ts`,
        };
      }
    } else {
      exportsConfig[`${fixedPath}`] = `./${fixedPath}${ext}`;
    }
  }
};

deepScan('src');

// scanDir('src').forEach((entityName) => {
//   exportsConfig[`./${entityName}`] = {
//     import: `./${entityName}/index.js`,
//     types: `./${entityName}/index.d.ts`,
//   };
// });

writeFile(
  'dist/package.json',
  JSON.stringify(
    {
      ...JSON.parse(readFile('package.json')),
      exports: exportsConfig,
    },
    null,
    2,
  ),
);

// execSync(`mkdir -p typings`, { stdio: 'inherit' });
// execSync(`cp src/lib/types.ts typings/index.d.ts`, { stdio: 'inherit' });
// execSync(`sed -i 's/^export type/type/' typings/index.d.ts`, { stdio: 'inherit' });
