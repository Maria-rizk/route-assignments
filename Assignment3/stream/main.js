const { log, error } = require('console');
const fs = require ('fs');
const path = require ('path');

//1
const readstream = fs.createReadStream  ('./big.txt', {encoding : 'utf-8'});
readstream.on ('data', (chunk) => {
    console.log("===================");

    console.log({chunk});
    
    console.log("===================");
})

//2
const readwritestream = fs.createReadStream  ('./source.txt', {encoding : 'utf-8'});
const writestream = fs.createWriteStream ('./dest.txt', {encoding : 'utf-8'});
readwritestream.on ('data', (chunk) => {
    console.log("===================");
    console.log({chunk});
    writestream.write (chunk);
    console.log("===================");

    
})

//3
const { createGzip} = require ('zlib');
const zip  = createGzip ();
const readpipestream = fs.createReadStream  ('./data.txt', {encoding : 'utf-8'});
const writepipestream = fs.createWriteStream ('./data.txt.gz', {encoding : 'utf-8'});
readpipestream.pipe (zip) .pipe (writepipestream) 
.on ('finish', () => {
    console.log('✅ Successfully compressed');
    
}) 
;

/**
 *  How Does Node.js Handle Asynchronous Operations Under the Hood?
 * Node.js delegates asynchronous operations to libuv which uses OS-level async APIs or its thread pool
 * 
 */

