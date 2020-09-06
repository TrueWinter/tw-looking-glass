var child_process = require('child_process');
function exec(command, cb) {
	return child_process.exec(command, { timeout: 60 * 1000 }, function(err, stdout, stderr) {
		if (err) {
			console.log(err.message);
			return cb(`Error while running command: ${err.message}`);
		}
		if (stderr) {
			console.log(stderr.message);
			return cb(`Error while running command: ${stderr.message}`);
		}

		console.log(stdout);
		cb(stdout);
	});
}

function ping4(host, cb) {
	exec(`ping -4 -n 4 ${host}`, function(output) {
		cb(output);
	});
}

function ping6(host, cb) {
	exec(`ping -6 -n 4 ${host}`, function(output) {
		cb(output);
	});
}

function trace4(host, cb) {
	exec(`tracert -4 ${host}`, function(output) {
		cb(output);
	});
}

function trace6(host, cb) {
	exec(`tracert -6 ${host}`, function(output) {
		cb(output);
	});
}

module.exports.ping4 = ping4;
module.exports.ping6 = ping6;
module.exports.trace4 = trace4;
module.exports.trace6 = trace6;