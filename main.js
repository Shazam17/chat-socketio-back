const { createRequire } = require('module');

const socket = require('socket.io');

const server = require('http').createServer( ((req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin' : 'localhost:3000',
    })
    res.end('');
}));

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    path: '',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});


io.on("connection", function (socket) {
    console.log("Made socket connection");
});

server.listen(4000);
