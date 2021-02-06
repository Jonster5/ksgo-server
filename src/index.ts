'use strict';
import http from 'http';
import url from 'url';
import WebSocket from 'ws';
import { Lobby } from './lobby';
import { MWSreconnect } from './mws';

const port = process.env.PORT || 8000;

console.clear();

MWSreconnect();

const server = http.createServer();
const WSS = new WebSocket.Server({ noServer: true });

const lobbies: Map<string, Lobby> = new Map();
const clients = new Map();

// lobbies.set('ffffff', new Lobby(server, lobbies, 'ffffff', [10, 'singlesun']));

WSS.on('connection', (ws, req) => {
	ws.on('close', (code) => {
		for (let [key, value] of clients) {
			if (value.socket !== ws) continue;
			console.log(`User disconnected: ${key}`);
			clients.delete(key);
			break;
		}
	});
	ws.on('message', (data: WebSocket.Data) => {
		let message = JSON.parse(data as string);

		if (message.id === 'user-connect') {
			if (!clients.has(message.content.clientid)) {
				clients.set(message.content.clientid, {
					name: message.content.name,
					socket: ws,
				});
				console.log(`User connected: ${message.content.clientid}`);
			}
		} else if (message.id === 'create-lobby') {
			if (lobbies.size <= 5) {
				let key = Math.random().toString(36).substring(7).toUpperCase();

				while (lobbies.has(key))
					key = Math.random().toString(36).substring(7).toUpperCase();

				// const lobby = new Lobby(server, lobbies, key, ...message.content);

				lobbies.set(
					key,
					new Lobby(server, lobbies, key, message.content)
				);

				// console.log(lobbies);
				console.log(key);
				// console.log(lobbies.size);

				ws.send(
					JSON.stringify({
						id: 'create-lobby-confirm',
						content: {
							key,
						},
					})
				);
			} else {
				ws.send(
					JSON.stringify({
						id: 'create-lobby-reject',
						content: {
							reason: 'Game server is full',
						},
					})
				);
			}
		}
	});
});

server.listen(port);

server.on('upgrade', (req, soc, head) => {
	const pathname = url.parse(req.url).pathname;

	console.log(pathname);

	if (pathname === '/') {
		WSS.handleUpgrade(req, soc, head, (ws: WebSocket) => {
			WSS.emit('connection', ws, req);
		});
	} else if (lobbies.has(pathname.split('/')[1])) {
		if (pathname.split('/')[2] === 'stat') {
			lobbies
				.get(pathname.split('/')[1])
				.AWSS.handleUpgrade(req, soc, head, (ws: WebSocket) => {
					lobbies
						.get(pathname.split('/')[1])
						.AWSS.emit('connections', ws, req);
				});
		} else if (pathname.split('/')[2] === 'game') {
			lobbies
				.get(pathname.split('/')[1])
				.GWSS.handleUpgrade(req, soc, head, (ws: WebSocket) => {
					lobbies
						.get(pathname.split('/')[1])
						.GWSS.emit('connections', ws, req);
				});
		}
	} else {
		console.log(pathname);
		soc.destroy();
	}
});

/* MWS -> ksgo-master/index.js: WSS */
// --- Master Server ---
// server-connect ->
// server-connect-confirm <-

/* ksgo-client/public/js/socket.js: SWS -> WSS */
// --- Client ---
// user-connect <-
// user-connect-confirm ->
// create-lobby <-
// create-lobby-confirm ->
// create-lobby-reject ->
