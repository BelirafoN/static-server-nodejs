# Static Server for NodeJS

[![Build Status](https://travis-ci.org/BelirafoN/static-server-nodejs.svg?branch=master)](https://travis-ci.org/BelirafoN/static-server-nodejs)
[![Code Climate](https://codeclimate.com/github/BelirafoN/static-server-nodejs/badges/gpa.svg)](https://codeclimate.com/github/BelirafoN/static-server-nodejs)
[![npm version](https://badge.fury.io/js/static-server-nodejs.svg)](https://badge.fury.io/js/static-server-nodejs)

## Возможности сервера 

1. Не имеет npm-зависимостей;
2. HTTP-методы: `GET`, `HEAD`, `OPTIONS`;
2. CORS;
3. Простая поддержка кэширования с `If-Modified-Since` заголовком
4. Установка произвольной директории в качетве корневой
5. Установка любого имени индексного файла для публичной каталога и его подкаталогов
6. Простой лог запросов в консоль
7. Готов к запуску из коробки

## CLI

```bash
node ./bin/nodess
``` 

или с помощью npm

```bash
npm start
```

## Параметры и опции CLI

- `--port` или `-p` - порт. По умолчанию `3000`
- `--public` или `-d` - публичный каталог сервера. По умолчанию `./public`
- `--cors` - поддержка CORS. По умолчанию `false`
- `--cache` - поддержка кэширования с`If-Modified-Since` заголовком. По умолчанию `false`. 
- `--index-file` - имя индексного файла для каталогов. По умолчанию `index.html`.
- `--verbose` - вывод лога запросов на консоль. По умолчанию `false`.

## Пример использования в коде
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

## Что может появиться в будущем

- расширенная поддержка кэширования
- поддержка gzip
- поддержка multipart/* 
- создание npm-пакета для удобной установки и распространения 

### Лицензия 
MIT 
