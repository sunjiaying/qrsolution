require("amd-loader");

const server = require('http').createServer();
const io = require('socket.io')(server);
const encrypt = require('./utils/encrypt');
const moment = require('moment');
const checkin = require('./actions/checkin');
const salarylogin = require('./actions/salarylogin');

// io.engine.generateId = function (req) {
//   return 1
// }

var map = {};
const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');

io.on('connection', client => {
  console.log('connected.');

  client.on('login', data => {
    console.log('login: ' + JSON.stringify(data));
    map[data.username] = data.id;
    console.log(map[data.username]);
  });

  client.on('event', data => {
    if (data.command === 'code') {
      var val = data.id + '|' + moment().format('YYYY-MM-DD HH:mm:ss') + '|' + data.action;
      var code = encrypt.genSign(val, key, iv);
      console.log(val);
      console.log(code);

      var msg = {}
      msg.type = 'validate';
      msg.code = code;
      
      io.to(data.id).emit('code', msg);
      return;
    }
    if (data.command === 'checkcode') {      
      var qr = data.qr;
      console.log('qr.code:', qr.code);
      var str = encrypt.deSign(qr.code,  key, iv);
      var strs = str.split('|');
      console.log('qrid', strs[0]);
      console.log('scanid:', data.id);
      console.log('scantime', strs[1]);
      console.log('action:', strs[2]);      
      var action = strs[2];
      var dif = moment().diff(moment(strs[1]), 'seconds', true);
      console.log('时差:', dif);
      if (dif < 17) {      
        // 去做要做的事情
        // 做完事情后，然后再告诉扫描端或者二维码展示端
        switch(strs[2]) {
          case 'checkin':
            checkin.action(data.id, function() {              
              // 发送消息给二维码展示端
              io.to(strs[0]).emit('ok', data.id);
              // 发送消息给扫描端        
              io.to(data.id).emit('ok', strs[0]);
            }, function() {
              // 发送消息给扫描端        
              io.to(data.id).emit('error', strs[0]);
            });
            break;
          case 'salarylogin':
            salarylogin.action(data.id, function(d) {              
              // 发送消息给二维码展示端
              io.to(strs[0]).emit('ok', data.id + '|' + d.url);
              // 发送消息给扫描端        
              io.to(data.id).emit('ok', strs[0]);
            }, function(err) {
              // 发送消息给扫描端        
              io.to(data.id).emit('error', err);
            });
            break;
          default:
            // 发送消息给二维码展示端
            io.to(strs[0]).emit('ok', data.id);
            // 发送消息给扫描端        
            io.to(data.id).emit('ok', strs[0]);
            break;
        }
      }
      return;
    }
  });
  client.on('disconnect', () => {
    console.log('disconnected.');
  });
});
server.listen(8000);