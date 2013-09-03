/**
 * Created by Andy<andy@away.name> on 02.09.13.
 */

var $path = require('path'),
    $fs = require('fs'),
    $yaml = require('js-yaml');

/**
 * Extend options with default params
 * @param {Object} options Source object
 * @param {Object} defaultOptions Default values for options
 * @param {Boolean} goInner Go Inner Objects
 * @returns {Object}
 */
var extendDefaultOptions = function(options, defaultOptions, goInner){
    var key;
    if (typeof options === 'object' && goInner) {
        for (key in defaultOptions) {
            if(defaultOptions.hasOwnProperty(key)){
                var inner = null;
                if (typeof defaultOptions[key] === 'object'){
                    inner = defaultOptions[key]['$inner'];

                }
                if (typeof options[key] === 'object' && inner == null){
                    inner = options[key]['$inner'];
                }
                if (inner == null){
                    inner = goInner;
                }
                options[key] = extendDefaultOptions(options[key], defaultOptions[key], inner);
            }
        }
        return options;
    } else if (options != null)
        return options;
    else
        return defaultOptions;
};


var Config = function(){

};

Config.prototype.load = function(source){

    var extendProperties = function(original, current){

        for(var key in current) if (current.hasOwnProperty(key)){
            var value = current[key];
            if (key == '$extends'){
                var obj = current[value];
                if (value.substring(0,1) === ':'){
                    value = value.substr(1).split('.');
                    obj = original;
                    for(var i = 0; i <  value.length; i++){
                        obj = obj[value[i]];
                    }
                }
                delete  current['$extends'];
                current = extendDefaultOptions(current, obj, true);
                return extendProperties(original, current);
            } if (key == '$include'){
                var include = new Config();
                include.load($path.join($path.dirname(source), value));
                delete  current['$include'];
                extendDefaultOptions(current, include, true);

            } else if (typeof value === 'object'){
                current[key] = extendProperties(original, current[key]);
            }
        }
        return current;
    };

    var removeSystemKeys = function(obj){
        if (typeof obj === 'object'){
            for(var key in obj) if (obj.hasOwnProperty(key)){
                if (key === '$inner'){
                    delete obj[key];
                } else {
                    obj[key] = removeSystemKeys(obj[key]);
                }
            }
        }
        return obj;
    };

    var _data = {};
    var ext = $path.extname(source);
    if (ext === '.yaml'){
        var contents = $fs.readFileSync(source, 'utf8');
        _data = $yaml.load(contents);
    } else {
        _data = require(source);
        if (typeof _data != 'object'){
            _data = {data: _data};
        }
    }
    _data = extendProperties(_data, _data);
    _data = removeSystemKeys(_data);
    extendDefaultOptions(this, _data, true);
};



module.exports = exports = Config;