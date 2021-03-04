# TrueWinter Looking Glass

A looking glass for Bird2 made in Node.js.

## Configuration

It is recommended to create a separate user account for the agent to run on with NOPASSWD sudo permissions for the looking glass commands. Example: `twlg ALL=(ALL) NOPASSWD: /bin/ping,/usr/bin/mtr,/bin/traceroute,/usr/sbin/birdc -r *` where `twlg` is the user.

Configure the looking glass web config in `web/config.js`. The followig configuration options are available, and all options are required.

- `ui.networkName`: The network name shown on the looking glass
- `ui.email`: An email address where people can contact you
- `ui.website`: A link to your main network website, or any other website you'd want linked here
- `ui.description`: An optional short description of the network. HTML is supported here
- `ui.asn`: The network ASN
- `agents[n].name`: The name for this router. This will be shown in the dropdown list
- `agents[n].id`: A unique ID for this router. This will be used internally for queries
- `agents[n].api`: The URL to the looking glass agent for this router
- `agents[n].key`: A pre-shared key used to prevent direct queries to the agent
- `agents[n].allowedCommands`: An array of commands that can be run against this router. Currently implemented commands are:
	- `ping4`: Ping to an IPv4 IP or domain
	- `ping6`: Ping to an IPv6 IP or domain
	- `trace4`: IPv4 traceroute
	- `trace6`: IPv6 traceroute
	- `mtr4`: IPv4 MTR
	- `mtr6`: IPv6 MTR
	- `show route all (primary)`: Runs `show route all for {target} primary` for an IP address
	- `show protocols (list)`: Will list all configured BGP protocols
	- `show protocols all`: Runs `show protocols all {target}`

The agent also has configuration options, and all options are required.

- `key`: A pre-shared key used to prevent direct queries to the agent. This should be the same one as configured in the web config.
- `allowedCommands`: An array of commands that can be run against this router. This should be the same as configured in the web config.

The following ports are used for the looking glass, and cannot currently be changed:

- 18087: Used by the agent to receive requests from the web app.
- 18088: Used by the web app to show the looking glass. This is the port you want your web server to proxy requests to.

## Dependencies

- `traceroute`
- `ping`
- `mtr`
- `bird2`
- `node` v12+

## Bugs

As with any software, this looking glass may have bugs. If you find any of these, please do open an issue. Ensure that your issue contains enough information to make finding the root cause of the bug easier.

Please note that the looking glass has only been fully tested on Ubuntu 20.04 and may have slight compatibility issues with other operating systems. Windows and MacOS are not supported and there are currently no plans to add support for these operating systems.

## Security

While I have tried to make the looking glass as secure as I could (by implementing validation checks wherever possible, using API keys and suggesting a seperate low-privilege user) there may be some security issues. If you do find any security issues, please read my [security policy](https://truewinter.dev/legal/security). **Do not report security issues through GitHub and only test on your own instance(s) of the looking glass**.

## License

TrueWinter Looking Glass is licensed under the MIT license. See the `LICENSE` file for more information.
