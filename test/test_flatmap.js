/*
 * @license MIT License
 *
 * Copyright (c) 2015 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var assert = require('power-assert');
var Some = require('../src/index').Some;
var None = require('../src/index').None;

describe('Option<T>.flatMap()', function(){
    describe('self is `None`', function () {
        var option = null;
        var isNotCalled = true;

        before(function(){
            var none = new None();
            option = none.flatMap(function(){
                isNotCalled = false;
            });
        });

        it('the returned value shoule be `None`', function() {
            assert.ok(option instanceof None);
        });

        it('the passed function should not be called', function() {
            assert.strictEqual(isNotCalled, true);
        });
    });

    describe('self is `Some<T>`', function () {

        describe('callback returns `None`', function () {
            var option = null;

            before(function(){
                var some = new Some(1);

                option = some.flatMap(function(val){
                    return new None();
                });
            });

            it('the returned value shoule be `None`', function() {
                assert.ok(option instanceof None);
            });
        });

        describe('callback returns `Some<T>`', function () {
            var EXPECTED = "1";
            var option = null;

            before(function(){
                var some = new Some(1);

                option = some.flatMap(function(val){
                    assert.ok(val !== EXPECTED);
                    return new Some(EXPECTED);
                });
            });

            it('the returned value shoule be `Some<T>`', function() {
                assert.ok(option instanceof Some);
            });

            it('the returned containing value shoule be expected', function() {
                assert.strictEqual(option.unwrap(), EXPECTED);
            });
        });

        describe('`fn` don\'t returns `Option<T>`', function () {
            var option = null;
            var error = null;

            before(function(){
                var some = new Some(1);

                try {
                    option = some.flatMap(function(val){
                        var rv = 'hoge';
                        assert.notStrictEqual(val !== rv);
                        return rv;
                    });
                }
                catch (e) {
                    error = e;
                }
            });

            after(function(){
                option = null;
                error = null;
            });

            it('should throw an error', function() {
                assert.ok(error instanceof Error);
            });

            it('the error message should be the expected', function() {
                assert.strictEqual(error.message, 'Option<T>.flatMap()\' param `fn` should return `Option<T>`.');
            });
        });
    });
});
