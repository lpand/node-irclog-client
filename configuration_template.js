module.exports = {
	irc: {
		server: 'irc.server.org'
	,	client: {
			nick: 'nodelog'
    ,	userName: 'nodeclient'
    ,	realName: 'nodeclient'
    ,	showErrors: true
    ,	autoConnect: true
    ,	channels: ['#ch1', '#ch2']
    ,	stripColors: true
    ,	messageSplit: 512
		}
	}
,	tcpClient: {
		hostname: '127.0.0.1'
	,	port: 8124
	}
,	events: {
		JOIN: 0
	,	PART: 1
	,	NICK: 2
	,	MESSAGE: 3
	, ME: 4
	}
,	db: {
		user: ''
	,	password: ''
	,	host: '127.0.0.1'
	,	port: 27017
	,	db: 'irc'
	}
,	express: {
		view: {
			engine: 'jade'
		,	ext: '.html'
		,	dir: '/views'
		}
	,	javascript: '/js'
	,	style: '/style'
	,	channels: [

		]
	}
};

