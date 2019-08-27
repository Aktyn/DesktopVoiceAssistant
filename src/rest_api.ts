import * as express from 'express';
import * as bodyParser from "body-parser";
import * as fs from 'fs';
import * as path from 'path';
import {parseResult} from './result_parser';

const app = express();

const client_dir = path.join(__dirname, '..', 'voice_listener');

const index_html = fs.readFileSync(client_dir + '/index.html', 'utf8');

export default {
	init(port: number, session_id: string) {
		/*app.use(function(req, res, next) {//ALLOW CROSS-DOMAIN REQUESTS
			res.header('Access-Control-Allow-Origin','*');
			res.header('Access-Control-Allow-Methods','GET,POST');
			res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
			
			next();
		});*/
		
		app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
		app.use(bodyParser.json({limit: '10mb'}));
		
		app.use(express.static(client_dir));
		
		app.get('/ping', (req, res) => {
			if( req.query['session_id'] !== session_id )
				res.send('INCORRECT_SESSION');
			else
				res.send('OK');
		});
		
		app.post('/check_result', (req, res) => {//[{result, confidence, type}], index
			try {
				if (!Array.isArray(req.body.results) || typeof req.body.index !== 'number')
					return res.jsonp({res: 'incorrect input'});
				let response: {[index: string]: any, res: string} = parseResult(req.body.results, req.body.index);
				return res.jsonp(response);
			}
			catch(e) {
				console.error(e);
				return res.jsonp({res: 'error'});
			}
		});
		
		app.get('*', (req, res) => res.send(index_html));
		app.listen(port);
	}
}