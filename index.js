var scratch = require('scratch-api');
var ws = require('socket.io-client')('https://j-snake.herokuapp.com/');
function encrypt(string) {
	var scratchConverter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.: 0123456789';
	var output = '';
	for (var i = 0; i < string.length; i++) {
		number = scratchConverter.indexOf(string[i]);
		if (typeof number == 'undefined') {
			return scratchConverter.indexOf(' ') + 1;
		} else {
			if (number.toString().length < 2) {
				output += '0';
			}
			output += number + 1;
		}
	}
	return output;
}
scratch.UserSession.load(function (err, user) {
	if (err) {
		return err;
	}
	user.cloudSession(145492790, function (err, cloud) {
		ws.on('updatePos', function (msg) {
			var size = [...msg.size];
			size = size[0] + ' ' + size[1];
			cloud.set('☁ size', encrypt(size));
			msg = msg.snakes;
			var positions = '';
			for (var i = 0; i < msg.length; i++) {
				var snakePos = '';
				for (var j = 0; j < msg[i].location.length; j++) {
					var loc = msg[i].location[j];
					for (var k = 0; k < loc.length; k++) {
						for (var l = 0; l < loc[k].toString().length; l++) {
							snakePos += encrypt(loc[k].toString()[l]);
						}
						if (k < loc.length - 1) snakePos += encrypt(',');
						else if (j < msg[i].location.length - 1) snakePos += encrypt(':');
						else if (i < msg.length - 1) snakePos += encrypt(' ');
					}
				}
				positions += snakePos;
			}
			cloud.set('☁ snakeData', positions);
		});
	});
});
