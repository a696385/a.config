/**
 * Created by Andy<andy@away.name> on 02.09.13.
 */

var util = require('util');
var config = require('../index');

config.load(__dirname + '/config.yaml');

//console.log(util.inspect(config, { showHidden: false, depth: null, colors: true }));
console.log(JSON.stringify(config));

