export default (initialState) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  // return {
  //   canSeeAdmin,
  // };
  if (initialState) {
    const { adminInfo } = initialState;
    return {
      normalAdmin: true,
      superAdmin: adminInfo.permission === 1
    }
  }
  return {
    normalAdmin: false,
    superAdmin: false
  }
};
