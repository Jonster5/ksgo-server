export interface ServerInfo {
	name: string;
	id: string;
	address: string;
}

export const serverinfo: ServerInfo = {
	name: 'Server', // change per region
	id: null,
	address: 'ws://192.168.1.157:8000',
	// address: 'wss://ksgo-server-us.herokuapp.com/',
};

export const msaddress = 'wss://ksgo-master.herokuapp.com';
// export const msaddress = 'ws://192.168.1.157:4000';
