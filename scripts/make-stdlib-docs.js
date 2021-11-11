const libs = require('../docs/_libs.json');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const ARGUMENT_TYPE = /_(\?[^_]+)_/g;
const DEFAULT_TYPE = /\[`([^`]+)`\](?!\()/g;

const docsDirectory = path.join(__dirname, '../docs/standard-library');

const stdlib = Object.entries(libs).map(([name, description]) => {
  return {name, description};
});

rimraf.sync(path.join(docsDirectory, '*.md'));

const toc = stdlib
  .map(({name, description}) => {
    return `* [${name}](./${name}): *${description}*`;
  })
  .join('\n');

const indexHeader = `---
layout: default
title: Standard library
nav_order: 1
has_children: true
has_toc: false
---

# Standard library

${toc}

## Interactive rendering

If what you need is interactive rendering of your graphs, in web applications for instance,
be sure to check out [sigma.js](https://www.sigmajs.org/), a webgl renderer
designed to work with \`graphology\` and which has been created for such endeavors.

## Installation

Any of the above packages can be installed through npm likewise (just change the name to
the desired package):

\`\`\`
npm install graphology-metrics
\`\`\`

For convenience, an aggregated package called \`graphology-library\` also exists
and depends on all the listed packages at once for convenience (albeit maybe
a little bit more complicated to optimize through tree-shaking).

You can install it thusly:

\`\`\`
npm install graphology-library
\`\`\`

If you do so, here is how to access the required packages:

\`\`\`js
// Importing a sub package
import * as metrics from 'graphology-library/metrics';

metrics.density(graph);

// Importing select parts of the library
import {metrics, layout} from 'graphology-library';

// Importing the whole library
import * as lib from 'graphology-library';

// Importing the browser-specific library
// (this is important for xml parsers and some layout's webworkers)
import * as lib from 'graphology-library/browser';
\`\`\`
`;

fs.writeFileSync(path.join(docsDirectory, 'index.md'), indexHeader);

stdlib.forEach(({name}, i) => {
  const libPath = path.join(__dirname, '../src', name);

  let readme = fs.readFileSync(path.join(libPath, 'README.md'), 'utf-8');

  const hasChangelog = fs.existsSync(path.join(libPath, 'CHANGELOG.md'));

  const githubUrl = `https://github.com/graphology/graphology/tree/master/src/${name}`;

  readme = readme.replace(/https:\/\/graphology\.github\.io/, '..');
  readme = readme.replace(
    /https:\/\/github\.com\/graphology\/graphology-([A-Za-z\-]+)/g,
    '/standard-library/$1'
  );
  readme = readme.replace(ARGUMENT_TYPE, '<span class="code">$1</span>');
  readme = readme.replace(DEFAULT_TYPE, '<span class="default">$1</span>');

  const content = `---
layout: default
title: ${name}
nav_order: ${i}
parent: Standard library
aux_links:
  "Library directory": "${githubUrl}"
  ${hasChangelog ? `"Changelog": "${githubUrl}/CHANGELOG.md"` : ''}
---

${readme}
`;

  fs.writeFileSync(path.join(docsDirectory, `${name}.md`), content);
});
