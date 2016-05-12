/**
 * Developer: BelirafoN
 * Date: 07.04.2016
 * Time: 16:52
 */

"use strict";

const cliArguments = require('../lib/helpers/cliArguments');
const assert = require('assert');

describe('cliArguments internal logic', () => {
    let argv = [];

    beforeEach(() => {
        argv = ['path to node', 'path to run script'];
    });

    it('Skip first two elements', () => {
        assert.deepEqual(cliArguments(argv), {});
    });

    it('Default "true" for option without value', () => {
        assert.deepEqual(cliArguments(argv.concat(['--cors'])), {'cors': true});
    });

    it('Get value of option', () => {
        assert.deepEqual(cliArguments(argv.concat(['--port=3000'])), {'port': 3000})
    });

    it('Camel case for names of options', () => {
        assert.deepEqual(cliArguments(argv.concat(['--index-file=index.html'])), {'indexFile': 'index.html'});
    });

    it('Get value of option under quote', () => {
        assert.deepEqual(cliArguments(argv.concat(['--index-file="фото номер один.png"'])), {'indexFile': 'фото номер один.png'})
    });

    it('Value of parametr not set', () => {
       assert.deepEqual(cliArguments(argv.concat(['-p'])), {});
    });

    it('Get parametr value with delimiter', () => {
        assert.deepEqual(cliArguments(argv.concat(['-p', '3000'])), {'p': 3000});
    });

    it('Get parametr value without delimiter', () => {
        assert.deepEqual(cliArguments(argv.concat(['-p3000'])), {'p': 3000});
    });

});