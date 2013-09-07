a.config - Node.js config system
========

Configuration system for Node.js Applications

Introduction
---------------------------------------

Configuration system created for systematization of the configuration files. You can simply extend, edit and monipalte yours configs.

Usage
---------------------------------------
**Install using npm**
```bash
project$ npm install a.config
```

You can write yours configs in `js`, `json`, `yaml`.

**Example config file**
```yaml
# Inner vars
$config:

  default.format.processor: 'default'
  default.format.value: '%level %date %args %code'

  production:
    mongo:
      uri: 'mongodb://localhost.loc:27017/log'
      ttl: 604800
      format:
        name: 'mongo'
        value: '%level, %module, %hostname, %args, %code, %trace, %errors'

  development:
    $extend: production # Extend production and change mongo.uri, mongo.ttl
    mongo:
      uri: 'mongodb://localhost:27017/log'
      ttl: 600

  prog12:
    $extend: development # Extend development and change mongo.uri
    mongo:
      uri: 'mongodb://localhost:27030/log'

# Logger System Configurations
default:
  all:
    console: true
    syslog: true

production:
  $extend: default # Extend default and append app property
  app:
    all,info,debug:
      - mongo:
         $extend: :$config.production.mongo # Extend $config.production.mongo
      - console: true
    error,warn:
      - mongo:
         $extend: :$config.production.mongo # Extend $config.production.mongo
        syslog: true
      - console: true
development:
  $extend: default # Extend default and update app property
  app:
    $replace: :production.app # Extend from production.app, with full change same properties
    all,info,debug:
      - console: true  
```

**Load configuration file**
```javascript
var config = require('a.config');
config.load(__dirname + '/config.yaml');
```
After config loading you can use this in all application
```javascript
var config = require('a.config');
console.log(config.default.all);

//{console: true, syslog: true}
```
For creation new instance of config object and load different config use `newInstance()`
```javascript
var config = require('a.config');
config.load(__dirname + '/config.yaml');

var exConfig = config.newInstance();
exConfig.load(__dirname + '/config.ex.yaml');

console.log(config.default.all);
//{console: true, syslog: true}

console.log(exConfig.default);
//undefined
```
**Extends**


For convenient use configurations used rashireniem:

* `$extend` - Extend current object, you must specify the name of the object. You can use local name(objects in same level) or name from root. For root location use `:` before name of object.
    
    *Example*
```yaml
	production:
	  mongo:
	    uri: 'mongodb://localhost.loc:27017/log'
	    ttl: 604800
	    format:
	      name: 'mongo'
	      value: '%level, %module, %hostname, %args, %code, %trace, %errors'
	
	development:
	  $extend: production
	  mongo:
	    uri: 'mongodb://localhost:27017/log'
	    ttl: 600
	
	user:
	  mongo:
	    $extend: :production.mongo
```
```json
{
    "production": {
        "mongo": {
            "uri": "mongodb://localhost.loc:27017/log",
            "ttl": 604800,
            "format": {
                "name": "mongo",
                "value": "%level, %module, %hostname, %args, %code, %trace, %errors"
            }
        }
    },
    "development": {
        "mongo": {
            "uri": "mongodb://localhost:27017/log",
            "ttl": 600,
            "format": {
                "name": "mongo",
                "value": "%level, %module, %hostname, %args, %code, %trace, %errors"
            }
        }
    },
    "user": {
        "mongo": {
            "uri": "mongodb://localhost.loc:27017/log",
            "ttl": 604800,
            "format": {
                "name": "mongo",
                "value": "%level, %module, %hostname, %args, %code, %trace, %errors"
            }
        }
    }
}
```

* `$replace` - Same as `$extend`, but it will rewrite all object
    
    *Example*
```yaml
	production:
	  mongo:
	    uri: 'mongodb://localhost.loc:27017/log'
	    ttl: 604800
	    format:
	      name: 'mongo'
	      value: '%level, %module, %hostname, %args, %code, %trace, %errors'
	
	user:
	  mongo:
	    $replace: :production.mongo
	    format:
	      caption: 'caption'
```
```json
{
    "production": {
        "mongo": {
            "uri": "mongodb://localhost.loc:27017/log",
            "ttl": 604800,
            "format": {
                "name": "mongo",
                "value": "%level, %module, %hostname, %args, %code, %trace, %errors"
            }
        }
    },
    "user": {
        "mongo": {
            "format": {
                "caption": "caption"
            },
            "uri": "mongodb://localhost.loc:27017/log",
            "ttl": 604800
        }
    }
}
```

* `$include` - Include some else file into current object. Use path relative to the current config
    
    *Example*
```yaml
	production:
	  mongo:
	    uri: 'mongodb://localhost.loc:27017/log'
	    ttl: 604800
	    format:
	      name: 'mongo'
	      value: '%level, %module, %hostname, %args, %code, %trace, %errors'
	
	user:
	  mongo:
	    $include: './configs/mongo.yaml'
```

License
---------------------------------------

May be freely distributed under the MIT license

See `LICENSE` file

Copyright (c) 2013 - Sumskoy Andrew <andy@away.name>
