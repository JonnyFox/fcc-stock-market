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

import { ConfigService } from './services';
import { Ticker, WsMessage } from './models';
import { WsMessages } from './ws-messages.enum';
import container from './config/inversify.conf';

let configService = container.get(ConfigService);
let serverConfig = new InversifyExpressServer(container);

serverConfig.setConfig((app) => {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/lib', express.static(path.join(__dirname, '../../node_modules')));
    app.use('/app', express.static(path.join(__dirname, '../public/app')));
    app.use(logger('dev'));
});

let server = serverConfig.build().listen(configService.port);

const wss = new WebSocket.Server({ server: server });

interface WebSocketExt extends WebSocket {
    isAlive: boolean;
}

let tickers: Ticker[] = [];

function sendMessage(ws: WebSocket, message: WsMessage) {
    ws.send(JSON.stringify(message));
}

wss.on('connection', (ws: WebSocketExt) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message: string) => {
        console.log('received: %s', message);

        let messageData = JSON.parse(message);

        if (messageData.type === WsMessages[WsMessages.AddTicker]) {
            tickers.push(messageData.data);

            wss.clients.forEach(cl => {
                cl.send(JSON.stringify({
                    type: WsMessages[WsMessages.GetTickers], data: tickers
                }))
            });
        }
    });

    sendMessage(ws, {
        type: WsMessages[WsMessages.GetTickers],
        data: tickers
    });
});



setInterval(() => {
    wss.clients.forEach((ws: WebSocketExt) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 10000);


console.log(`Server started on port ${configService.port} :)`);
exports = module.exports = server;