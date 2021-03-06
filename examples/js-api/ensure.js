#!/usr/bin/env node

/*
 * Copyright (C) 2010-2014 by Revolution Analytics Inc.
 *
 * This program is licensed to you under the terms of Version 2.0 of the
 * Apache License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0) for more 
 * details.
 */

/* 
 * usage: $ node ensure.js
 *
 * Simple promise chaining using `.ensure()` and `.then()` based on the 
 * Promises/A+ specs. 
 */

var config      = require('../config'),
    credentials = config.credentials,
    deployr     = require('../../deployr').configure( { host: config.endpoint });

var ruser = deployr.auth(credentials.username, credentials.password);

ruser.script('/testuser/root/DeployR - Hello World.R')
  .end(function() {
    console.log('script');
  })
  .ensure(function() {
    console.log('finally cleanup...'); 
    // using `ruser` implies that a logout occurs on the same user session
    ruser.release();
  })
  .then(function(res) {
    console.log('then this.');
    return res; // pass result to the next `.then()`
  }, function(err) {
    console.log(err);
  })
  .then(function(res) {
    console.log('after that then this.');
    return res; // pass result to the next `.then()`
  })
  .then(function(res) {
    console.log('after that then we are done.');
    console.log(res);
  });