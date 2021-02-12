const sock = require('socket.io');

const server = require('http').createServer( ((req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin' : 'localhost:3000',
    })
    res.end('');
}));

class ChatClient {
    id = '';
    userName = '';

    constructor(id, userName) {
        this.id = id;
        this.userName = userName;
    }
}

const generateId = () => Math.floor(Math.random() * 1000);

class ChatApp {

    connected = [];

    constructor(server) {
        const io = sock(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
            path: '',
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

        io.on("connection", (socket) => {
            console.log("Made socket connection");
            socket.username = "Anonym";

            let id = generateId();
            this.connected.push(new ChatClient(id, socket.username));
            socket.broadcast.emit('new_person', {id:id, name:socket.username});
            socket.emit('new_person', {id:id, name:socket.username});

            socket.on('change_username', (data) => {
                console.log("change_username");
                const index = this.connected.findIndex((item) => item.id === id);
                this.connected[index].userName = data.username;
                socket.username = data.username;
                socket.broadcast.emit('new_person', {id:id, name:data.username});
                socket.emit('new_person', {id:id, name:data.username});
            });

            socket.on('send_message', (arg) => {
                console.log("new message");
                console.log(arg);
                socket.broadcast.emit('new_message', {message:arg.message, client: arg.client,name: socket.username});
            });



            socket.on('disconnect',() => {
                this.connected = this.connected.filter((item) => item.id !== id);
                socket.broadcast.emit('user_disconnect', {id:id});
            });
        });



        server.listen(4000);
    }
}


const app = new ChatApp(server);

