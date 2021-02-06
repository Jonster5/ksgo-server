import { serverinfo, msaddress } from './data';
import WebSocket from 'ws';

let MWS: WebSocket;

const mwsopen = () => {
	console.info('MWS: Connected');
	MWS.send(
		JSON.stringify({
			id: 'server-connect',
			content: {
				name: serverinfo.name,
				address: serverinfo.address,
			},
		})
	);
};

const mwsmessage = ({ data }: WebSocket.MessageEvent) => {
	const message = JSON.parse(data as string);

	if (message.id === 'server-connect-confirm') {
		serverinfo.id = message.content;
		console.log(`server registered as ${serverinfo.id}`);
	}
};

const mwserror = (err: WebSocket.ErrorEvent) => {
	console.info(err.message);
	setTimeout(MWSreconnect, 1000);
};

const mwsclose = () => {
	console.info(MWS.readyState);
	// MWSreconnect();
};

export const MWSreconnect = () => {
	console.info('MWS: Connecting...');
	MWS = new WebSocket(msaddress);
	MWS.onopen = mwsopen;
	MWS.onmessage = mwsmessage;
	MWS.onerror = mwserror;
	MWS.close = mwsclose;
};
