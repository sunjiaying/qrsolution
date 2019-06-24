const crypto = require('crypto');

define(function (){
  // 加密
  var genSign = function (src, key, iv) {
    let sign = '';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    sign += cipher.update(src, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
  }

  // 解密
  var deSign = function (sign, key, iv) {
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    src += cipher.update(sign, 'hex', 'utf8');
    src += cipher.final('utf8');
    return src;
  }


  return {
    genSign: genSign,
    deSign: deSign
  };
});
