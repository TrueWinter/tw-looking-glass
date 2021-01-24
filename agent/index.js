var express = require('express');
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

	if (!config.allowedCommands.includes(req.body.command)) {
		return res.status(400).json({ success: false, message: 'Command not allowed' });
	}

	var commandRequiresSpecificIPVersion = ['4', '6'].includes(req.body.command.charAt(req.body.command.length - 1) !== '4');
	var commandDoesNotAllowDomains = ['show route all (primary)'].includes(req.body.command);

	if (isInSubnet.isIPv4(req.body.target)) {
		// eslint-disable-next-line eqeqeq
		if (commandRequiresSpecificIPVersion && req.body.command.charAt(req.body.command.length - 1) != 4) {
			return res.status(400).json({ success: false, message: 'Please use one of the IPv4 commands' });
		}
	} else if (isInSubnet.isIPv6(req.body.target)) {
		// eslint-disable-next-line eqeqeq
		if (commandRequiresSpecificIPVersion && req.body.command.charAt(req.body.command.length - 1) != 6) {
			return res.status(400).json({ success: false, message: 'Please use one of the IPv6 commands' });
		}
	} else if (!commandDoesNotAllowDomains && isValidDomain(req.body.target)) {
		// Domain is valid
	} else {
		return res.status(400).json({ success: false, message: 'Invalid domain or IP' });
	}

	console.log(`Running ${req.body.command}. Target: ${req.body.target}`);

	switch (req.body.command) {
		case 'ping4':
			utils.ping4(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'ping6':
			utils.ping6(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'trace4':
			utils.trace4(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'trace6':
			utils.trace6(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'mtr4':
			utils.mtr4(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'mtr6':
			utils.mtr6(req.body.target, function(output) {
				res.json(output);
			});
			break;
		case 'show route all (primary)':
			utils.showRouteAllPrimary(req.body.target, function(output) {
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