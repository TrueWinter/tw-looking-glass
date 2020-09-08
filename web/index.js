var express = require('express');
var ejs = require('ejs');
var isValidIP = require('is-my-ip-valid')();
var isValidDomain = require('is-valid-domain');
var isInSubnet = require('is-in-subnet');
var isPortReachable = require('is-port-reachable');
var url = require('url');
var path = require('path');
var axios = require('axios');
var qs = require('qs');
var morgan = require('morgan');

var config = require('./config.js');
const { json } = require('express');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, path.sep, 'static')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('combined'));

app.get('/', function(req, res) {
	res.render('index', { config });
});

function getRouterById(id, cb) {
	var i = 0;
	config.agents.forEach(function (agent) {
		if (agent.id === id) {
			return cb(null, agent);
		} else if (config.agents.length === i + 1) {
			var err = new Error('Router not in config');
			return cb(err, null);
		}
		i++;
	});
}

app.post('/process', function(req, res) {
	if (!(req.body.router && req.body.command && req.body.target)) {
		return res.status(400).json({ success: false, message: 'Required data not in request' });
	}

	var ipVersion = 0;

	getRouterById(req.body.router, function(err, router) {
		if (err) {
			return res.status(400).json({ success: false, message: err.message });
		}

		if (!router.allowedCommands.includes(req.body.command)) {
			return res.status(400).json({ success: false, message: 'Command not allowed' });
		}

		if (isInSubnet.isIPv4(req.body.target)) {
			if (req.body.command.charAt(req.body.command.length - 1) !== '4') {
				return res.status(400).json({ success: false, message: 'Please use one of the IPv4 commands' });
			}
			ipVersion = 4;
		} else if (isInSubnet.isIPv6(req.body.target)) {
			if (req.body.command.charAt(req.body.command.length - 1) !== '6') {
				return res.status(400).json({ success: false, message: 'Please use one of the IPv6 commands' });
			}
			ipVersion = 6;
		} else if (isValidDomain(req.body.target)) {
			// Domain is valid
		} else {
			return res.status(400).json({ success: false, message: 'Invalid domain or IP' });
		}

		var routerHost = url.parse(router.api).hostname;
		var routerPort = url.parse(router.api).port;

		this.CancelToken = axios.CancelToken;
		this.cancel;

		axios.post(router.api, qs.stringify({
			command: req.body.command,
			target: req.body.target,
			key: router.key
		}, {
			cancelToken: new CancelToken(function executor(c) {
			// An executor function receives a cancel function as a parameter
			cancel = c;
			})
		})).then(function (response) {
			res.json(response.data);
		}).catch(function (error) {
			console.log(error);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				res.status(error.response.status).json({ success: false, message: error.response.data.message });
			  } else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
				res.status(500).json({ success: false, message: 'Error while querying router' });
			  } else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
				res.status(500).json({ success: false, message: error.message });
			  }
		});

		isPortReachable(routerPort, { host: routerHost }).then(function (reachable) {
			if (!reachable) {
				console.log(router.id + ' appears to be down');
				cancel();
				res.status(500).json({ success: false, message: 'Selected router appears to be down' });
			}
		});
	});
});

app.listen('18088', function() {
	console.log('Listeing on port 18088');
});