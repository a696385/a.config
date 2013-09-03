module.exports = {
    server: {
        host: "localhost",

        port: 3001,

        options: { $inner: false,
            someOpt1: true,
            someOpt2: ['a1','a2']
        }
    },
    servers: { $inner: false,
        server1: {
            host: '127.0.0.1'
        },
        server2: {
            host: '127.0.0.2'
        }
    }
};