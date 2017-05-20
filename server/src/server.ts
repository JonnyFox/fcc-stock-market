import 'reflect-metadata';
import * as logger from 'morgan';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as http from 'http';
import * as url from 'url';
import * as WebSocket from 'ws';

import { InversifyExpressServer } from 'inversify-express-utils';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/lib', express.static(path.join(__dirname, '../../node_modules')));
app.use('/app', express.static(path.join(__dirname, '../public/app')));
app.use('*', express.static(path.join(__dirname, '../public/index.html')));

const wss = new WebSocket.Server({ server });

wss.on('connection', (client: WebSocket) => {
    client.on('message', (message: string) => {
        console.log('received: %s', message);
        if (message.startsWith('broad:')) {
            message =message.replace(/broad\:/g, '');
            wss.clients.forEach(cl => {
                cl.send(message);
            });
        } else {
            client.send(`Received -> ${message}`);
        }
    });

    client.send('hi there');
});

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});