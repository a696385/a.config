module.exports = {
    production: { $include: 'config.production.js',
        server: {
            port: 3003
        },
        servers: {$inner: false,
            server1: {
                host: '127.0.0.1'
            },
            server2: {
                host: '127.0.0.2'
            }
        },
        server3: {a1: true}
    },

    development: { $extends: ':production',
        server: {
            port: 3002,
            options: {
                someOpt3: false
            }
        },
        servers: {
            server3: {
                host: '127.0.0.3'
            }
        }
    }
};