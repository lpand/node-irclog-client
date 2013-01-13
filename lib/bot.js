

var bot = function(CONF) {
	var net = require('net')
		,	irc = require('irc')
		,	msgpack = require('msgpack')
		,	util = require('irclog-util')
		, ircClient, tcpClient;

	function error (message) {
		console.error(message);
		tcpClient.end();
	}

	function createIRCClient () {
		ircClient = new irc.Client(CONF.irc.server
			, CONF.irc.client.nick
			, CONF.irc.client);

		var re = /^\s*ACTION\s(.*)$/;
			
		ircClient.on('error', function (e) {
			error(' ERROR: there was an error with the irc client - '+ e);

		}).on('join', function (channel, nick, message) {
			var t = util.time();
			console.log(' '+ t +' JOIN event');
			tcpClient.write(msgpack.pack({
				time: t
			,	event: CONF.events.JOIN
			,	nick: nick
			,	host: message.host
			, channel: channel
			}));

		}).on('part', function (channel, nick, reason, message) {
			var t = util.time();
			console.log(' '+ t +' PART event');
			tcpClient.write(msgpack.pack({
				time: t
			,	event: CONF.events.PART
			,	nick: nick
			,	host: message.host
			, channel: channel
			}));

		}).on('nick', function (oldnick, newnick, message) {
			var t = util.time();
			console.log(' '+ t +' NICK event');
			tcpClient.write(msgpack.pack({
				time: t
			,	event: CONF.events.NICK
			,	oldnick: oldnick
			,	newnick: newnick
			,	channel: message[0]
			}));
			
		}).on('message#', function (nick, to, text, message) {
			var t = util.time();
			console.log(' '+ t +' MESSAGE event');
			console.log(' message: ', text);
			tcpClient.write(msgpack.pack({
				time: t
			,	event: CONF.events.MESSAGE
			,	nick: nick
			,	text: text
			, channel: to
			}));

		}).on('ctcp-privmsg', function (from, to, text) {
			var t = util.time()
				,	res = re.exec(text);
			console.log(' '+ t +' CTCP-PRIVMSG event');
			if (!res)
				return;
			// else
			tcpClient.write(msgpack.pack({
				time: t
			,	event: CONF.events.ME
			, from: from
			,	text: res[1]
			, channel: to
			}));
		});

	}

	tcpClient = net.createConnection(CONF.tcpClient, function () {
		console.log(' Tcp client connected');
		createIRCClient();

	}).on('end', function () {
		console.log(' Tcp client disconnected');

	}).on('error', function (e) {
		error( ' There was an error with the tcp client. The socket will be closed\n', e);
		console.trace();
	});

	process.on('exit', function () {
		error();
	});
};

if (require.main === module) {
  var c = require('config');
  bot(c);
} else {
	module.exports.startBot = bot;
}
