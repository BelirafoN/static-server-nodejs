/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 17:29
 */

"use strict";

const mime = require('../lib/helpers/mime');
const assert = require('assert');

describe('MIME-type detector by file extension', () => {

    it('Returned mime-type for extension with dot', () => {
        assert.equal(mime('.html'), 'text/html')
    });

    it('Returned mime-type for extension without dot', () => {
        assert.equal(mime('html'), 'text/html')
    });

    it('Returned "text/html" for unknown extension', () => {
        assert.equal(mime('unknown-ext'), 'text/html')
    });

    let extsForTest = {
        html : 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        png: 'image/png',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        ico: 'image/x-icon'
    };

    Object.keys(extsForTest).forEach(ext => {
        it(`MIME-type for ${ext} is '${extsForTest[ext]}'`, () => {
            assert.equal(mime(ext), extsForTest[ext]);
        })
    });
});