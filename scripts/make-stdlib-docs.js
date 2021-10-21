const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const HIDDEN = new Set(pkg.hiddenPackages);
const ARGUMENT_TYPE = /_(\?[^_]+)_/g;
const DEFAULT_TYPE = /\[`([^`]+)`\](?!\()/g;

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

  readme = readme.replace(/https:\/\/graphology\.github\.io/, '..');
  readme = readme.replace(
    /https:\/\/github\.com\/graphology\/graphology-([A-Za-z\-]+)/g,
    '/standard-library/$1'
  );
  readme = readme.replace(ARGUMENT_TYPE, '<span class="code">$1</span>');
  readme = readme.replace(DEFAULT_TYPE, '<span class="default">$1</span>');

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
// todo: switch to metadata & drop hiddenPackages
// todo: upgrade deploy script
// todo: hide -library and document it in the index rather
