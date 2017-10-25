//config for Twilio
var cfg = {};

cfg.twilioAccountId = '';
cfg.authToken = '';


var app = new (require('express'))();
var bodyParser = require('body-parser');
var _ = require('lodash');
var wt = require('webtask-tools');
var request = require('request-promise@1.0.2');
var twilio = require('twilio');
var sms = new twilio(cfg.twilioAccountId, cfg.authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/message', (req, res) => {
  var respNum = req.body.From;
  var smsBody = req.body.Body;
  if (smsBody.toLowerCase() === 'hi' || smsBody.toLowerCase === 'hello') {
    // greeting message
    sms.messages.create({
      body: 'Welcome to epic snow. Please type the mountain you want to shred at. Options are: ' +
      'Vail, Beaver Creek, Afton Alps, Breckenridge, Keystone, or Kirkwood.',
      to: respNum,
      from: 'YOUR NUMBER'
    }).then((message) => console.log(message.sid));
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end();
  } else {
    // test for a mountain in the customer query
    request.get('http://www.epicmix.com/vailresorts/sites/epicmix/api/mobile/mountains.ashx', (error, response, body) => {
      var respData = JSON.parse(body);
      var mountain = _.find(respData.mountains, 'name', smsBody);
      if (mountain) {
        request.get('http://www.epicmix.com/vailresorts/sites/epicmix/api/mobile/weather.ashx', (error, response, body) => {
          var weatherData = JSON.parse(body);
          var currentweather = _.find(weatherData.snowconditions, 'resortID', mountain.id);

          sms.messages.create({
            body: mountain.name + ' currently has ' +
            currentweather.midMountainBase + ' inches of base and ' + currentweather.newSnow +
            ' inches of new snow. Get out there and ride!',
            mediaUrl: mountain.logoURLString,
            to: respNum,
            from: 'YOUR NUMBER'
          }).then((message) => console.log(message.sid));
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end();
        });
      } else {
        // if no mountain is found from the API
        sms.messages.create({
          body: 'We were not able to find your mountain. Could you try again with exact spelling please?',
          to: respNum,
          from: 'YOUR NUMBER'
        }).then((message) => console.log(message.sid));
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end();
      }
    });

  }
});

app.get('/', (req, res) => {
  res.send('Starting up the app');
  res.end();
});

module.exports = wt.fromExpress(app).auth0({
  exclude: [
    '/',
    '/message'
  ]
});