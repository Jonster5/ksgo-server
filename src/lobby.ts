// const WebSocket = require('ws');
// const maps = require('./maps');

import WebSocket from 'ws';
import http from 'http';
import { maps, MapItem } from './maps/maps';

export class Lobby {
	key: string;
	users: Map<any, any>;
	maxUsers: number;
	lobbies: Map<string, Lobby>;
	server: http.Server;
	map: MapItem;
	updateloop: NodeJS.Timeout;

	AWSS: WebSocket.Server;
	GWSS: WebSocket.Server;

	constructor(
		server: http.Server,
		lobbylist: Map<string, Lobby>,
		key = '',
		[maxUsers = 10, map = '']
	) {
		this.key = key;
		this.users = new Map();
		this.maxUsers = maxUsers;
		this.lobbies = lobbylist;
		this.server = server;

		switch (map) {
			case 'empty':
				this.map = maps[0];
				break;
			case 'singlesun':
				this.map = maps[1];
				break;
			default:
				this.map = maps[0];
				return;
		}

		this.AWSS = new WebSocket.Server({ noServer: true });
		this.GWSS = new WebSocket.Server({ noServer: true });

		this.AWSS.on('connection', (ws, req) => {
			ws.on('message', this.onAWSSMessage);
			ws.on('close', this.onAWSSClose);
		});

		this.GWSS.on('connection', (ws, req) => {
			ws.on('message', this.onGWSSMessage);
			ws.on('close', this.onGWSSClose);
		});

		this.updateloop = setInterval(this.update, 15);
	}
	update() {}
	kill() {
		clearInterval(this.updateloop);
		this.AWSS.close();
		this.GWSS.close();
		this.lobbies.delete(this.key);
	}

	onAWSSMessage(data: WebSocket.MessageEvent) {
		console.log(data);
	}
	onAWSSClose(data: WebSocket.CloseEvent) {}
	onGWSSMessage(data: WebSocket.MessageEvent) {}
	onGWSSClose(data: WebSocket.CloseEvent) {}
}

export default Lobby;
