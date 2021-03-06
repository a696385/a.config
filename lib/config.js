/**
 * Created by Andy<andy@away.name> on 02.09.13.
 */

var $path = require('path'),
    $fs = require('fs'),
    $yaml = require('js-yaml'),
    $clone = require('clone');

/**
 * Extend options with default params
 * @param {Object} source Source object
 * @param {Object} target Default values for options
 * @returns {Object}
 */
var extendDefaultOptions = function(source, target){
    var key;
    if (typeof target === 'object') {
        for (key in source) {
            if(source.hasOwnProperty(key)){
                target[key] = extendDefaultOptions(target[key], source[key]);
            }
        }
        return target;
    } else if (target != null)
        return target;
    else
        return source;
};

/**
 * Extract properties from object
 * @param {Object} obj
 * @returns {Object}
 */
var saveOriginalProperties = function(obj){
    var result = {};
    for(var key in obj) if (obj.hasOwnProperty(key)){
        result[key] = obj[key];
        delete obj[key];
    }
    return result;
};

/**
 * Cope properties from source object to target with rewrite
 * @param {Object} source
 * @param {Object} target
 * @returns {Object}
 */
var copyProperties = function(source, target){
    for(var key in source) if (source.hasOwnProperty(key)){
        var value = source[key];
        if (Array.isArray(value) || value instanceof Object ) {
            if (value['$replace'] != null || value['$extend'] != null) {
                target[key] = $clone(value);
                continue;
            }
            if (target[key] == null){
                if (Array.isArray(value)) target[key] = [];
                else target[key] = {};
            }
            target[key] = copyProperties(value, target[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
};

/**
 * Cope properties from source object to target with rewrite in first level
 * @param {Object} source
 * @param {Object} target
 * @returns {Object}
 */
var copyPropertiesFirstLevel = function(source, target){
    for(var key in source) if (source.hasOwnProperty(key)){
        if (target[key] == null) {
            target[key] = source[key];
        }
    }
    return target;
};


var Config = function(){
    this._addedProperties = [];
};

Config.prototype._loadObj = function(source){
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
    return _data;
};

Config.prototype.load = function(source){

    var compilate = function(root, parent, current){
        for(var key in current) if (current.hasOwnProperty(key)){
            var value = current[key];

            if (typeof value !== 'object') continue;

            if (value['$include'] != null){
                var _include = value['$include'];
                delete value['$include'];

                var _original = saveOriginalProperties(value);
                var _includeData = this._loadObj($path.join($path.dirname(source), _include));
                _includeData = extendDefaultOptions(_includeData, _original);
                value = copyProperties(_includeData, value);
            } else if (value['$replace'] != null){
                var _replace = value['$replace'];
                delete value['$replace'];

                var _includeData = null;
                if (_replace.substring(0,1) === ':'){
                    var names = _replace.substr(1).split('.');
                    var obj = root;
                    for(var i = 0; i <  names.length; i++){
                        obj = obj[names[i]];
                    }
                    _includeData = $clone(obj);
                } else {
                    _includeData = $clone(current[_replace]);
                }

                var _original = saveOriginalProperties(value);
                _original = copyPropertiesFirstLevel(_includeData, _original);
                value = copyProperties(_original, value);
            } else if (value['$extend'] != null){
                var _replace = value['$extend'];
                delete value['$extend'];

                var _includeData = null;
                if (_replace.substring(0,1) === ':'){
                    var names = _replace.substr(1).split('.');
                    var obj = root;
                    for(var i = 0; i <  names.length; i++){
                        obj = obj[names[i]];
                    }
                    _includeData = $clone(obj);
                } else {
                    _includeData = $clone(current[_replace]);
                }

                var _original = saveOriginalProperties(value);
                _includeData = copyProperties(_original, _includeData);
                value = copyProperties(_includeData, value);
            }
            compilate(root, current, current[key]);
        }


        return current;
    }.bind(this);

    var _data = this._loadObj(source);
    _data = compilate(_data, _data, _data);
    this._addedProperties = [];
    for(var key in _data) if (_data.hasOwnProperty(key)){
        this._addedProperties.push(key);
    }
    copyProperties(_data, this);
    return this;
};

/**
 * Enable config environment
 * @param {String} [env] Current environment
 * @returns {Config}
 */
Config.prototype.env = function(env){
    if (env == null) env = process.env.NODE_ENV || 'production';
    var envData = this[env] || {};
    for(var i = 0, len = this._addedProperties.length; i < len; i++){
        delete this[this._addedProperties[i]];
    }
    delete this._addedProperties;
    copyProperties(envData, this);
    return this;
};

/**
 * Create new Instance of Config
 * @returns {Config}
 */
Config.prototype.newInstance = function(){
    return new Config();
};


module.exports = exports = Config;