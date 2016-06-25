net = require('net');
binary = require('binary');

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
    });

HOST = '192.168.1.6'
PORT = 37777
net.createServer(function (socket) {
	console.log('New client');
	var client = net.Socket();
	try {
	    client.connect(PORT, HOST, function() {
		    console.log('Connected to DVR');
		});
	} catch(err) {
	}

	socket.on('data', function(data) {
		console.log('App sent data');
		try {
		    client.write(data);
		} catch(err) {
		}
	    });
	client.on('data', function(data) {
		console.log('DVR sent data');
		if (data[0] == 180) {
		    data[41] = 81;
		    data[42] = 83;
		}
		try {
		    socket.write(data);
		} catch(err) {
		}
	    });
	socket.on('end', function() {
		console.log('App closed');
		try {
		    client.end();
		} catch(err) {
		}
	    });
	client.on('end', function() {
		console.log('DVR closed');
		try {
		    socket.end();
		} catch(err) {
		}
	    });
	socket.on('close', function() {
		console.log('App closed');
		try {
		    client.destroy();
		} catch(err) {
		}
		try {
		    socket.destroy();
		} catch(err) {
		}
	    });
	client.on('close', function() {
		console.log('DVR closed');
		try {
		    socket.destroy();
		} catch(err) {
		}
		try {
		    client.destroy();
		} catch(err) {
		}
	    });
    }).listen(37777);

