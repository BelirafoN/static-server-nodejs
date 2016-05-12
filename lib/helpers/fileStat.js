/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 13:07
 */

"use strict";

const fs = require('fs');

module.exports = fileStat;

/**
 *
 * @param filePath
 * @returns {Promise}
 */
function fileStat(filePath){
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if(err){
                reject(err);
                return;
            }
            resolve(stats);
        })
    });
}