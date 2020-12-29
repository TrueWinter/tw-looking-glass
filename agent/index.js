var express = require('express');
var isValidIP = require('is-my-ip-valid')();
var isValidDomain = require('is-valid-domain');
var isInSubnet = require('is-in-subnet');
var morgan = require('morgan');

var config = require('./config.js');
var utils = require('./utils.js');

var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('combined'));

app.post('/', function(req, res) {
	if (!(req.body.key && req.body.command && req.body.target)) {
		return res.status(400).json({ success: false, message: 'Required data not in request' });
	}

	if (req.body.key !== config.key) {
		return res.status(400).json({ success: false, message: 'Invalid key' });
	}

	var ipVersion = 0;

	if (!config.allowedCommands.includes(req.body.command)) {
		return res.status(400).json({ success: false, message: 'Command not allowed' });
	}

	if (isInSubnet.isIPv4(req.body.target)) {
		if (req.body.command.charAt(req.body.command.length - 1) != 4) {
			return res.status(400).json({ success: false, message: 'Please use one of the IPv4 commands' });
		}
		ipVersion = 4;
	} else if (isInSubnet.isIPv6(req.body.target)) {
		if (req.body.command.charAt(req.body.command.length - 1) != 6) {
			return res.status(400).json({ success: false, message: 'Please use one of the IPv6 commands' });
		}
		ipVersion = 6;
	} else if (isValidDomain(req.body.target)) {
		// Domain is valid
	} else {
		return res.status(400).json({ success: false, message: 'Invalid domain or IP' });
	}

	switch (req.body.command) {
		case 'ping4':
			utils.ping4(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'ping6':
			utils.ping6(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'trace4':
			utils.trace4(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'trace6':
			utils.mtr4(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'mtr4':
			utils.mtr6(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'mtr6 ':
			utils.trace6(req.body.target, function(output) {
				res.json(output);
			});
			return;
		case 'bgp':
			utils.bgp(req.body.target, function(output) {
				res.json(output);
			});
			break;
		default:
			res.end('Unknown command');
	}

});

app.listen('18087', function() {
	console.log('Listening on port 18087');
});