#!/usr/bin/env node
var path   = require('path');
var script = path.basename(__filename);

var errorFile = process.argv[2];
if (!errorFile) {
  console.error('Usage: ./' + script + ' path/to/errmsg-utf8.txt');
  process.exit(1);
}

var fs     = require('fs');
var errors = fs.readFileSync(errorFile, 'utf-8');

var number = Number(errors.match(/start-error-number (\d+)/)[1]);
var codes  = errors.match(/^([A-Z_]+)/mg)

var source =
  '// Generated by ' + script + ', do not modify by hand\n' +
  codes
    .map(function(code) {
      return 'exports[' + (number++) + '] = \'' + code + '\';';
    })
    .join('\n');

var targetFile = path.join(__dirname, '../lib/protocol/constants/errors.js');
fs.writeFileSync(targetFile, source, 'utf-8');

console.log('Wrote constants to ' + targetFile);
