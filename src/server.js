/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 12:56
 */

"use strict";

const httpServer = require('http').Server;
const path = require('path');
const fs = require('fs');
const requestLog = require('./helpers/requestLog');
const fileStat = require('./helpers/fileStat');
const mime = require('./helpers/mime');

let allowMethods = ['GET', 'HEAD', 'OPTIONS'];

module.exports = createServer;

/**
 *
 * @param publicDir
 * @param options
 * @returns {*}
 */
function createServer(publicDir, options){
    options = options || {};
    options = {
        cors: options.cors || false,
        cache: options.cache || false,
        indexFile: options.indexFile || 'index.html',
        verbose: options.verbose || false,
        headers: options.headers || null
    };

    return new httpServer()
        .on('request', (req, res) => {
            res.setHeader('Server', 'NodeJS Static Server');

            if(options.headers){
                Object.keys(options.headers).forEach(headerName => {
                    res.setHeader(headerName, options.headers[headerName]);
                });
            }

            let queryStr = decodeURI(req.url).split('?')[0];
            if(queryStr === '/'){ queryStr = options.indexFile; }

            if(!~allowMethods.indexOf(req.method)){
                res.writeHead(501, 'Not Implemented', {"Allow": allowMethods.join(', ')});
                res.end();
                requestLog({
                    httpVersion: req.httpVersion,
                    method: req.method,
                    query: queryStr,
                    statusCode: 501
                }, options);
                return;
            }

            if(req.method === 'OPTIONS'){
                if(options.cors){
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', 'Accept, X-Requested-With, Content-Type');
                    res.setHeader('Access-Control-Allow-Method', allowMethods.join(', '));

                }else{
                    res.setHeader('Allow', allowMethods.join(', '));
                }

                if(queryStr === '/*' || queryStr === '*'){
                    res.writeHead(200, 'OK');
                    res.end();
                    requestLog({
                        httpVersion: req.httpVersion,
                        method: req.method,
                        query: queryStr,
                        statusCode: 200
                    }, options);
                    return;
                }
            }

            let fileName = path.join(publicDir, path.normalize(queryStr.split('?')[0]));

            fileStat(fileName)
                .then(stats => {
                    if(stats.isDirectory()){
                        fileName = path.join(fileName, options.indexFile);
                        return fileStat(fileName);
                    }
                 return stats;
                })
                .then(stats => {
                    res.setHeader('Content-Type', mime(path.extname(fileName)));
                    res.setHeader('Last-Modified', stats.mtime.toUTCString());

                    if(req.method === 'GET'){
                        if(
                            options.cache &&
                            req.headers['if-modified-since'] &&
                            /^\w+,\s\d{2}\s\w+\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT$/.test(req.headers['if-modified-since'])
                        ){
                            let modifiedSince = new Date(req.headers['if-modified-since']);

                            if(stats.mtime < modifiedSince){
                                res.writeHead(304, 'Not Modified');
                                res.end();
                                return 304;
                            }
                        }

                        let readStream = fs.createReadStream(fileName);

                        res.writeHead(200, 'OK', {
                            'Content-Length': stats.size
                        });

                        readStream
                            .on('error', error => {
                                readStream.unpipe(res);
                                res.end();
                            })
                            .pipe(res);

                        req.on('abort', () => {
                            options.verbose && console.log('client connection aborted.');
                            readStream.unpipe(res);
                            readStream.destroy();
                        });

                    }else{
                        res.writeHead(200, 'OK');
                        res.end();
                    }

                    return 200;
                })
                .catch(error => {
                    let statusCode = 500,
                        statusMessage = 'Internal Server Error';

                    switch (error.code){
                        case 'EISDIR':
                        case 'EACCES':
                            statusCode = 403;
                            statusMessage = 'Forbidden';
                            break;

                        case 'ENOENT':
                            statusCode = 404;
                            statusMessage = 'Not Found';
                            break;

                        default:
                            statusCode = 500;
                            statusMessage = 'Internal Server Error';
                            break;
                    }
                    res.writeHead(statusCode, statusMessage);
                    res.end();
                    return statusCode;
                })
                .then(statusCode => requestLog({
                    httpVersion: req.httpVersion,
                    method: req.method,
                    query: queryStr,
                    statusCode: statusCode
                }, options));
        })
        .on('close', () => {
            options.verbose && console.log('Server closed.');
        });
}