var child_process = require('child_process');
function exec(command, cb) {
	return child_process.exec(command, { timeout: 60 * 1000 }, function(err, stdout, stderr) {
		if (err) {
			console.log(err.message);
			return cb({ success: false, message: `Error while running command: ${err.message}` });
		}
		if (stderr) {
			console.log(stderr.message);
			return cb({ success: false, message: `Error while running command: ${stderr.message}` });
		}

		cb({ success: true, message: stdout });
	});
}

function ping4(host, cb) {
	exec(`ping -4 -c 4 ${host}`, function(output) {
		cb(output);
	});
}

function ping6(host, cb) {
	exec(`ping -6 -c 4 ${host}`, function(output) {
		cb(output);
	});
}

function trace4(host, cb) {
	exec(`sudo traceroute -I -4 -w 2 -q 1 ${host}`, function(output) {
		cb(output);
	});
}

function trace6(host, cb) {
	exec(`sudo traceroute -I -6 -w 2 -q 1 ${host}`, function(output) {
		cb(output);
	});
}

function mtr4(host, cb) {
	exec(`sudo mtr -4 -b -o "LDRSNBAWVGJMXI" -rwc10 ${host}`, function(output) {
		cb(output);
	});
}

function mtr6(host, cb) {
	exec(`sudo mtr -6 -b -o "LDRSNBAWVGJMXI" -rwc10 ${host}`, function(output) {
		cb(output);
	});
}

function showRouteAllPrimary(target, cb) {
	exec(`sudo birdc -r 'show route all for ${target} primary'`, function(output) {
		cb(output);
	});
}

module.exports.ping4 = ping4;
module.exports.ping6 = ping6;
module.exports.trace4 = trace4;
module.exports.trace6 = trace6;
module.exports.mtr4 = mtr4;
module.exports.mtr6 = mtr6;
module.exports.showRouteAllPrimary = showRouteAllPrimary;