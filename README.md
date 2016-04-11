## Simple Static Server for NodeJS

### Available features 

1. No npm-dependencies;
2. HTTP-methods: `GET`, `HEAD`, `OPTIONS`;
2. CORS;
3. Support simple cache with `If-Modified-Since` header
4. Set any directory as public
5. Set any file as index-file for server and for subdirectories of public directory
6. Simple requests-log to console 
7. Ready to run out of box

### CLI Run 

```bash
node ./bin/nodess
``` 

or with npm

```bash
npm start
``` 

### CLI Parameters & Options

- `--port` or `-p` - port for listen. Default `3000`
- `--public` or `-d` - public directory. Default `./public`
- `--cors` - enable CORS support. Default `false`
- `--cache` - enable support simple cache with `If-Modified-Since` header. Default `false`. 
- `--index-file` - name of custom index-file. Default `index.html`.
- `--verbose` - print request-log to console. Default `false`.

### Example of usage in cоde
```js
const path = require('path');
const createStaticServer = require('simple-node-static-server/server');
const port = 3000;

let staticServer = createStaticServer(path.join(__dirname, './public'),{
    cors: true,
    cache: true,
    indexFile: 'index.html',
    verbose: true
})
    .listen(port, '127.0.0.1', () => {
        console.log(`Server run and listen on ${port} port.`);
    });
```

### Road map 

- extended cache-headers support
- gzip support
- support multipart/* 
- create npm-package 

### License 
MIT License