define(function (){
  var action = function (id, success, error) {
    try {
      console.log('id转换为工号');
      console.log('工号进行打卡登记');
      success();
    }
    catch (err) {
      error();
    }
  };

  return {
    action: action
  };
});
