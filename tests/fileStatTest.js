/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 17:47
 */

"use strict";

const fileStat = require('../src/helpers/fileStat');
const path = require('path');
const fs = require('fs');
const asser = require('assert');

describe('fileStat internal logic', () => {

    it('Returned promise', () => {
        asser.ok(fileStat('') instanceof Promise);
    });

    it('Resolve returned promise with stats', done => {
        fileStat(path.join(__dirname, './fixtures/index.html'))
            .then(stats => {
                if(stats instanceof fs.Stats){ done(); }
            });
    });

    it('Reject returned promise with system error', done => {
        fileStat(path.join(__dirname, `./fixtures/${Date.now()}.html`))
            .catch(error => {
                if(error.code === 'ENOENT'){ done(); }
            });
    });

});