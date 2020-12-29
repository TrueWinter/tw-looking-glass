# TrueWinter Looking Glass

A looking glass for Bird2 made in Node.js.

## Configuration

It is recommended to create a separate user account for the agent to run on with NOPASSWD sudo permissions for the looking glass commands. Example: `twlg ALL=(ALL) NOPASSWD: /bin/ping,/usr/bin/mtr,/bin/traceroute,/usr/sbin/birdc -r *` where `twlg` is the user.

Configure the looking glass web config in `web/config.js`. The followig configuration options are available, and all options are required.

- `ui.networkName`: The network name shown on the looking glass
- `ui.email`: An email address where people can contact you
- `ui.website`: A link to your main network website, or any other website you'd want linked here
- `agents[n].name`: The name for this router. This will be shown in the dropdown list
- `agents[n].id`: A unique ID for this router. This will be used internally for queries.
- `agents[n].api`: The URL to the looking glass agent for this router
- `agents[n].key`: A pre-shared key used to prevent direct queries to the agent
- `agents[n].allowedCommands`: An array of commands that can be run against this router. Currently implemented commands are:
	- `ping4`: Ping to an IPv4 IP or domain
	- `ping6`: Ping to an IPv6 IP or domain
	- `trace4`: IPv4 traceroute
	- `trace6`: IPv6 traceroute
	- `mtr4`: IPv4 MTR
	- `mtr6`: IPv6 MTR
	- `bgp`: Runs `show route all...` for an IP address

The agent also has configuration options, and all options are required.

- `key`: A pre-shared key used to prevent direct queries to the agent. This should be the same one as configured in the web config.
- `allowedCommands`: An array of commands that can be run against this router. This should be the same as configured in the web config.

# Dependencies

- `traceroute`
- `ping`
- `mtr`
- `bird2`
- `node` v12+