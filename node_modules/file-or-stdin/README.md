# file-or-stdin

[![npm version](https://img.shields.io/npm/v/file-or-stdin.svg)](https://www.npmjs.com/package/file-or-stdin)
[![Build Status](https://travis-ci.org/shinnn/file-or-stdin.svg?branch=master)](https://travis-ci.org/shinnn/file-or-stdin)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/file-or-stdin.svg)](https://coveralls.io/github/shinnn/file-or-stdin?branch=master)

Read a file, or read [stdin](https://nodejs.org/api/process.html#process_process_stdin) if no files are specified

```javascript
// echo "Hello!" | node example.js
const fileOrStdin = require('file-or-stdin');

(async () => {
  (await fileOrStdin('path/to/a/file')).toString() // file contents;
  (await fileOrStdin(null)).toString(); //=> 'Hello!'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install file-or-stdin
```

## API

```javascript
const fileOrStdin = require('file-or-stdin');
```

### fileOrStdin(*filePath* [, *options*])

*filePath*: `string` or a [falsy value](https://developer.mozilla.org/docs/Glossary/Falsy)  
*options*: `Object` ([`fs.readFile`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) options) or `string` (encoding)   
Return: `Promise<Buffer>` or `Promise<string>`

When the first argument is a file path, it reads the given file and returns a promise of the file contents.

When the first argument is a falsy value, it reads [stdin](http://www.linfo.org/standard_input.html) and returns a promise of the buffered stdin data.

```javascript
// echo "nodejs" | node example.js
(async () => {
  await fileOrStdin('', 'utf8'); //=> 'nodejs'
})();
```

```javascript
// echo "nodejs" | node example.js
(async () => {
  await fileOrStdin('', 'base64'); //=> 'bm9kZWpz'
})();
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
