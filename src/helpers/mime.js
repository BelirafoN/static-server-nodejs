/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 13:02
 */

"use strict";

module.exports = mime;

/**
 *
 * @param fileExtension
 * @returns {string}
 */
function mime(fileExtension){
    fileExtension = fileExtension.toString().toLowerCase().replace(/^\./, '');

    let mimeMap = {
        'html': 'text/html',
        'txt': 'text/plain',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'bpm': 'image/bmp',
        'gif': 'image/gif',
        'png': 'image/png',
        'ico': 'image/x-icon',
        'js': 'text/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'xml': 'application/xml',
        'wav': 'audio/wav',
        'midi': 'audio/midi',
        'mp3': 'audio/mpeg3',
        'pdf': 'application/pdf',
        'mpeg': 'video/mpeg',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'zip': 'application/zip',
        'gzip': 'application/x-gzip',
        'gz': 'application/x-gzip',
        'webmanifest': 'application/manifest+json'
    };

    return mimeMap[fileExtension] ? mimeMap[fileExtension] : 'text/html';
}