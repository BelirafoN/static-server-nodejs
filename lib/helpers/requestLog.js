/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 13:06
 */

"use strict";

module.exports = requestLog;

/**
 * 
 * @param data
 * @param options
 */
function requestLog(data, options){
    options = options || {};
    
    if(options.verbose){
        console.log(`${new Date().toUTCString()} HTTP/${data.httpVersion} ${data.method} ${data.query} ${data.statusCode}`);
    }
}