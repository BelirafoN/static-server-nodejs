/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 16:45
 */

"use strict";

const createSever = require('../lib/server');
const http = require('http');
const path = require('path');
const assert = require('assert');

describe('Static server work test', () => {
    const port = 3001,
        host = '127.0.0.1',
        serverPublicPath = path.join(__dirname, './fixtures');

    let server = null,
        requestOptions = {};

    beforeEach(() => {
        Object.assign(requestOptions, {
            host,
            port,
            method: 'GET',
            path: '/'
        });
    });

    describe('Base functionality', () => {

        before(done => {
            server = createSever(serverPublicPath, {
                cors: false,
                cacheHeaders: false,
                verbose: false
            }).listen(port, host, done);
        });

        after(() => server.close());

        it('GET /index.html -> 200', done => {
            requestOptions.path = '/index.html';

            http.request(requestOptions, response => {
                let content = '';

                response
                    .setEncoding('utf-8')
                    .on('data', chunk => content += chunk)
                    .on('end', () => {
                        if(
                            response.statusCode === 200 &&
                            content.includes('<title>NodeJS simple static server</title>')
                        ){ done(); }
                    });
            }).end();
        });

        it('GET /index2.html -> 404', done => {
            requestOptions.path = '/index2.html';

            http.request(requestOptions, response => {
                if(response.statusCode === 404){ done(); }
            }).end();
        });

        ['/folder', '/folder/'].forEach(path => {
            it(`GET ${path} -> 200 + index file from this directory`, done => {
                requestOptions.path = path;

                http.request(requestOptions, response => {
                    let content = '';

                    response
                        .setEncoding('utf-8')
                        .on('data', chunk => content += chunk)
                        .on('end', () => {
                            if(
                                response.statusCode === 200 &&
                                content.includes('<div>Folder index file!</div>')
                            ){ done(); }
                        });
                }).end();
            });
        });

    });

    describe('HTTP methods', () => {

        before(done => {
            server = createSever(serverPublicPath, {
                cors: false,
                cacheHeaders: false,
                verbose: false
            }).listen(port, host, done);
        });

        after(() => server.close());

        ['GET', 'HEAD', 'OPTIONS'].forEach(method => {
            it(`${method} / -> 200`, done => {
                requestOptions.method = method;

                http.request(requestOptions, response => {
                    if(response.statusCode === 200){ done(); }
                }).end();
            });
        });

        ['POST', 'PUT', 'PATCH', 'TRACE', 'DELETE'].forEach(method => {
            it(`${method} / -> 501`, done => {
                requestOptions.method = method;

                http.request(requestOptions, response => {
                    if(response.statusCode === 501){ done(); }
                }).end();
            });
        });
    });

    describe('Server headers', () => {

        before(done => {
            server = createSever(serverPublicPath, {
                cors: true,
                cacheHeaders: false,
                verbose: false,
                headers: {
                    'X-Test': 'test'
                }
            }).listen(port, host, done);
        });

        after(() => server.close());

        it(`GET-response has base set of headers`, done => {
            http.request(requestOptions, response => {
                let headerNames = Object.keys(response.headers),
                    isHeaderSetValid = [
                        'server',
                        'content-type',
                        'last-modified',
                        'content-length',
                        'date',
                        'connection'
                    ].every(headerName => ~headerNames.indexOf(headerName));

                if( response.statusCode === 200 && isHeaderSetValid ){ done(); }
            }).end();
        });

        it(`Response of not implemented request has 'Allow' header`, done => {
            requestOptions.method = 'POST';

            http.request(requestOptions, response => {
                if(
                    response.statusCode === 501 &&
                    response.headers['allow']
                ){ done(); }
            }).end();
        });

        it(`Set custom headers (X-...)`, done => {
            requestOptions.method = 'HEAD';

            http.request(requestOptions, response => {
                if(
                    response.statusCode === 200 &&
                    response.headers['x-test'] === 'test'
                ){ done(); }
            }).end();
        });

        ['HEAD', 'OPTIONS'].forEach(method => {
            it(`${method}-response hasn't 'Content-Length' header and content`, done => {
                requestOptions.method = method;

                http.request(requestOptions, response => {
                    let content = '';

                    response
                        .setEncoding('utf-8')
                        .on('data', chunk => content += chunk)
                        .on('end', () => {
                            if(
                                response.statusCode === 200 &&
                                !~Object.keys(response.headers).indexOf('content-length') &&
                                content === ''
                            ){ done(); }
                        });
                }).end();
            });
        });
    });

    describe('CORS-headers support', () => {

        describe('Disables CORS-headers', () => {

            before(done => {
                server = createSever(serverPublicPath, {
                    cors: false,
                    cacheHeaders: false,
                    verbose: false
                }).listen(port, host, done);
            });

            after(() => server.close());

            it(`OPTIONS-response hasn't cors-headers`, done => {
                requestOptions.method = 'OPTIONS';

                http.request(requestOptions, response => {
                    let headerNames = Object.keys(response.headers);

                    if(
                        response.statusCode === 200 &&
                        !~headerNames.indexOf('access-control-allow-origin') &&
                        !~headerNames.indexOf('access-control-allow-headers') &&
                        !~headerNames.indexOf('access-control-allow-method') &&
                        ~headerNames.indexOf('allow')
                    ){ done(); }
                }).end();
            });
        });

        describe('Enable CORS-headers', () => {
            before(done => {
                server = createSever(serverPublicPath, {
                    cors: true,
                    cacheHeaders: false,
                    verbose: false
                }).listen(port, host, done);
            });

            after(() => server.close());

            it(`OPTIONS-response has CORS-headers`, done => {
                requestOptions.method = 'OPTIONS';

                http.request(requestOptions, response => {
                    let headerNames = Object.keys(response.headers);

                    if(
                        response.statusCode === 200 &&
                        ~headerNames.indexOf('access-control-allow-origin') &&
                        ~headerNames.indexOf('access-control-allow-headers') &&
                        ~headerNames.indexOf('access-control-allow-method')
                    ){ done(); }
                }).end();
            });
        });
    });

    describe('Cache headers support', () => {

        describe('Disables cache headers', () => {

            before(done => {
                server = createSever(serverPublicPath, {
                    cacheHeaders: false,
                    verbose: false
                }).listen(port, host, done);
            });

            after(() => server.close());

            it(`GET / with "if-modified-since" header`, done => {
                requestOptions.headers = {
                    "If-Modified-Since": new Date().toUTCString()
                };

                http.request(requestOptions, response => {
                    if(response.statusCode === 200){
                        done();
                    }
                }).end();
            });
        });

        describe('Enable cache headers', () => {
            before(done => {
                server = createSever(serverPublicPath, {
                    cacheHeaders: true,
                    verbose: false
                }).listen(port, host, done);
            });

            after(() => server.close());

            it(`GET / with "if-modified-since" header`, done => {
                requestOptions.headers = {
                    "If-Modified-Since": new Date().toUTCString()
                };

                http.request(requestOptions, response => {
                    if(response.statusCode === 304){
                        done();
                    }
                }).end();
            });
        });
    });

});