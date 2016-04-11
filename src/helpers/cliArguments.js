/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 12:57
 */

"use strict";

module.exports = getCliArguments;

/**
 *
 * @param args
 * @returns {{}}
 */
function getCliArguments(args){
    let argSlice = args.slice(2),
        execResults,
        result = {};

    for(let i = 0; i < argSlice.length; i++){
        let argument = argSlice[i].toString().trim();

        if((execResults = /^--(.+)=(.+)$/.exec(argument)) !== null){
            result[toCamelCase(execResults[1])] = execResults[2].replace(/^['"]+|['"]+$/g, '');
            continue;
        }

        if((execResults = /^--(.+)$/.exec(argument)) !== null){
            result[toCamelCase(execResults[1])] = true;
            continue;
        }

        if((execResults = /^-([a-zA-Z])$/.exec(argument)) !== null){
            if(i + 1 < argSlice.length && !argSlice[i + 1].startsWith('-')){
                result[execResults[1]] = argSlice[i + 1].toString().trim();
                i++;
            }

        }else if((execResults = /^-([a-zA-Z])(.+)$/.exec(argument)) !== null){
            result[execResults[1]] = execResults[2].replace(/^['"]+|['"]+$/g, '');
        }
    }
    return result;
}

/**
 *
 * @param str
 * @returns {string}
 */
function toCamelCase(str){
    return str.replace(/^-+|-+$/g, '')
        .replace(/-(.)/g, function(found){
            return found[1].toUpperCase();
        });
}

