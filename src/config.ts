export interface ConfigSchema {
	ws_port: number;//websocket ws_port
	express_port: number | null;
	open_listener: boolean;
	chrome_command: string;
	use_native_notifications: boolean;
}

export const CONFIG: ConfigSchema = {//NOTE: no undefined values
	"ws_port": 3456,
	"express_port": 4567,
	"open_listener": true,
	"chrome_command": 'google-chrome',//TODO: change default chrome command according to OS
	"use_native_notifications": false
};

type config_key = keyof typeof CONFIG;

export function setConfig(_config: Partial<ConfigSchema> = {}) {
	for( let key of <config_key[]>Object.keys(CONFIG) ) {
		if( _config.hasOwnProperty(key) )
			//@ts-ignore
			CONFIG[key] = _config[key];
	}
	return CONFIG;
}