# Static Server for NodeJS

[![Build Status](https://travis-ci.org/BelirafoN/static-server-nodejs.svg?branch=master)](https://travis-ci.org/BelirafoN/static-server-nodejs)
[![Code Climate](https://codeclimate.com/github/BelirafoN/static-server-nodejs/badges/gpa.svg)](https://codeclimate.com/github/BelirafoN/static-server-nodejs)
[![npm version](https://badge.fury.io/js/static-server-nodejs.svg)](https://badge.fury.io/js/static-server-nodejs)

## Available features 

1. No npm-dependencies;
2. HTTP-methods: `GET`, `HEAD`, `OPTIONS`;
2. CORS;
3. Support simple cache with `If-Modified-Since` header
4. Set any directory as public
5. Set any file as index-file for server and for subdirectories of public directory
6. Simple requests-log to console 
7. Ready to run out of box

## CLI Run 

```bash
node ./bin/nodess
``` 

or with npm

```bash
npm start
``` 

## CLI Parameters & Options

- `--port` or `-p` - port for listen. Default is `3000`
- `--public` or `-d` - public directory. Default is `./public`
- `--cors` - enable CORS support. Default is `false`
- `--cache` - enable support simple cache with `If-Modified-Since` header. Default is `false`. 
- `--index-file` - name of custom index-file. Default is `index.html`.
- `--verbose` - print request-log to console. Default is `false`.

## Examples
```js
const createStaticServer = require('static-server-nodejs');
const path = require('path');
const PORT = 3000;

let staticServer = createStaticServer(path.join(__dirname, './public'),{
    cors: true,
    cache: true,
    indexFile: 'index.html',
    verbose: true
})
    .listen(PORT, '127.0.0.1', () => {
        console.log(`Server run and listen on ${PORT} port.`);
    });
```

For examples, please, see `./examples/*` or tests `./test/*`.

## Tests 

Tests require [Mocha](https://mochajs.org/). 

```bash 
mocha ./tests
``` 

or with `npm` 

```bash
npm test 
```

Test coverage with [Istanbul](https://gotwarlost.github.io/istanbul/) 

```bash
npm run coverage
```

## Road map 

- extended cache-headers support
- gzip support
- support multipart/* 
- create npm-package 

## License 

Licensed under the MIT License 