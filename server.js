const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Home.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Index.html'));
});

app.get('/secondary.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Secundario.html'));
});

const estados = {};

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', (message) => {
        const { id, estado, time } = JSON.parse(message);
        estados[id] = { estado, time };

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ id, estado, time }));
            }
        });
    });
});

server.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor WebSocket escuchando en el puerto ${process.env.PORT || 8080}`);
});
