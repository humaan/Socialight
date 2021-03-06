var serialport = require('serialport');
var express = require('express');
var app = express();

var Client = require('node-rest-client').Client;
var client = new Client();
var w_api = ""; // get your api posts url from waaffle!
var w_events = [];

// create serial port, open immediately
// and write status message to server console
var SerialPort = serialport.SerialPort;
var port = new SerialPort('/dev/cu.usbmodem1421', {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, true, function(err, bytesWritten) {
  if (err) {
    return console.log('Error: ', err.message);
  }
  console.log(bytesWritten, 'bytes written');
});
port.on('open', showPortOpen);
port.on('data', sendSerialData);
port.on('close', showPortClose);
port.on('error', showError);

function showPortOpen() {
  console.log('port open. Data rate: ' + port.options.baudRate);
}
 
function sendSerialData(data) {
  console.log(data);
}
 
function showPortClose() {
  console.log('port closed.');
}
 
function showError(error) {
  console.log('Serial port error: ' + error);
}

function trigger(platform, activity, res) {
  console.log('From internet: ' + platform + '/' + activity);
  port.write(platform + '/' + activity);
  // res.send('Logged ' + platform + ' - ' + activity);
}

function sendEvents() {
  if (w_events.length > 0) {
    var my_event = w_events.shift();
    if (my_event.platform=='instagram') {
      trigger('INST', 'lik');
    } else if (my_event.platform=='twitter') {
      trigger('TWIT', 'ret');
    }
    setTimeout(sendEvents,2000);
  }
}

try {
  client.get(w_api, {}, function(data, response) {
    data.data.forEach(function(current, index, arr) {
      w_events.push({
        platform: current.source,
      });
      console.log(current.source);
    });
    console.log('--- done ---');
    sendEvents();
  });  
} catch (e) {
  if (w_api == '') {
    console.log('go to waaffle and get your API url first');
    process.exit();
  }
}

// app.use('/', function (req, res) {
//   res.send('Hello World!');
// });
app.use(express.static(__dirname + '/public'));
app.use('/', express.static('/public/index.html'))

app.all('/twitter/like', function (req, res) {
  trigger('TWIT', 'lik', res);
});
app.all('/twitter/retweet', function (req, res) {
  trigger('TWIT', 'ret', res);
});
app.all('/twitter/follow', function (req, res) {
  trigger('TWIT', 'fol', res);
});
app.all('/twitter/mention', function (req, res) {
  trigger('TWIT', 'men', res);
});
app.all('/twitter/message', function (req, res) {
  trigger('TWIT', 'msg', res);
});

app.all('/instagram/like', function (req, res) {
  trigger('INST', 'lik', res);
});
app.all('/instagram/follow', function (req, res) {
  trigger('INST', 'fol', res);
});
app.all('/instagram/mention', function (req, res) {
  trigger('INST', 'men', res);
});
app.all('/instagram/tag', function (req, res) {
  trigger('INST', 'tag', res);
});
app.all('/instagram/message', function (req, res) {
  trigger('INST', 'msg', res);
});

app.use(function(req, res) {
  console.error('misc event');
  res.send('are you trying to hack?');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});