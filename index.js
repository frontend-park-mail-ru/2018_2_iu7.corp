const http = require('http');
const fs = require('fs');
const debug = require('debug');

const PORT = 3000;
const log = debug('*');


const server = http.createServer( (req, res) => {

	const filename = req.url === '/' ? './public/index.html' : `./public${req.url}`;
	
	log('request: %s', req.url);
	log('filename: %s', filename);

	fs.readFile(filename , (err, file) => {
        if (err) {
        	res.statusCode = 404;
	    	res.end('404');
	    	return;
        }

	    res.write(file);
	    res.end();
	});
});


server.listen(PORT, () => {
	log('server started on port: %s', PORT);
});
