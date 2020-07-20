// 前端的用户权限是根据用户登录后后端返回的

const getUserAuthorityList = function() {
  let authorityList = ["user", "admin"];
  return authorityList;
};

/*
    some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
    some() 方法会依次执行数组的每个元素：

        如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
        如果没有满足条件的元素，则返回false。
*/

const checkAuthority = function(authority) {
  // authority: 路由所需要的权限数组
  let userAuthority = getUserAuthorityList();
  let authRequset = true;

  // 包含关系不对？
  // return userAuthority.some(item => authority.includes(item));

  authority.forEach(item => {
    if (!userAuthority.includes(item)) {
      authRequset = false;
      return authRequset;
    }
  });
  return authRequset;
};

const isLogin = function() {
  let login = true;
  return login;
};

export { getUserAuthorityList, checkAuthority, isLogin };
