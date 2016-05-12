/**
 * Developer: BelirafoN
 * Date: 12.05.2016
 * Time: 13:18
 */

"use strict";

const createStaticServer = require('static-server-nodejs');
const path = require('path');
const PORT = 3000;

createStaticServer(path.join(__dirname, './public'))
    .listen(PORT, '127.0.0.1', () => {
        console.log(`Server run and listen on ${PORT} port.`);
    });