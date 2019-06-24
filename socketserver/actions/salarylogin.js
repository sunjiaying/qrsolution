define(function (){
  var action = function (id, success, error) {
    try {
      console.log('id转换为工号');
      console.log('工号进行工资系统登陆...');
      var data = {}
      data.url = 'https://www.baidu.com';
      success(data);
    }
    catch (err) {
      if (!error) {
        error(err);
      }
    }
  };

  return {
    action: action
  };
});
