const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const HIDDEN = new Set(pkg.hiddenPackages);

const docsDirectory = path.join(__dirname, '../docs/standard-library');

const stdlib = Object.keys(pkg.dependencies)
  .filter(key => key !== 'graphology' && !HIDDEN.has(key))
  .map(key => key.replace(/^graphology-/, ''))
  .sort();

rimraf.sync(path.join(docsDirectory, '*.md'));

const indexHeader = `---
layout: default
title: Standard library
nav_order: 1
has_children: true
---

# Standard library
`;

fs.writeFileSync(path.join(docsDirectory, 'index.md'), indexHeader);

stdlib.forEach((lib, i) => {
  const libPath = path.join(__dirname, '../src', lib);
  let readme = fs.readFileSync(path.join(libPath, 'README.md'), 'utf-8');

  readme = readme.replace(/https:\/\/graphology.github.io/, '..');

  const content = `---
layout: default
title: ${lib}
nav_order: ${i}
parent: Standard library
---

${readme}
`;

  fs.writeFileSync(path.join(docsDirectory, `${lib}.md`), content);
});

// todo: links to other libs, link to repo
