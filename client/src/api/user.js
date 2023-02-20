import request from "./request";

// 处理所有请求用户的接口

export function getCaptcha() {
    return request({
        url: '/res/captcha',
        method: 'GET'
    })
}

// 判断用户是否存在
export function userIsExist(loginId) {
    return request({
        url: `/api/user/userIsExist/${loginId}`,
        method: 'GET'
    })
}

// 注册用户
export function addUser(registerInfo) {
    return request({
        url: '/api/user/',
        method: 'POST',
        data: registerInfo
    })
}

//用户登录
export function userLogin(loginInfo) {
    return request({
        url: '/api/user/login',
        method: 'POST',
        data: loginInfo
    })
}

//根据_id获取用户信息
export function getUserByID(userId) {
    return request({
        url: `/api/user/${userId}`,
        method: 'GET'
    })
}

// 根据token恢复用户信息
export function getInfoByToken() {
    return request({
        url: '/api/user/whoami',
        method: 'GET'
    })
}

// 获取积分前十的用户
export function getUserByPointsRank() {
    return request({
        url: '/api/user/pointsrank',
        method: 'GET'
    })
}

//根据id修改用户
export function updateUserInfo(id, userInfo) {
    return request({
        url: `/api/user/${id}`,
        method: 'PATCH',
        data: userInfo
    })
}

// 判断用户的密码是否正确
export function checkPasswordIsRight(userId, loginPwd) {
    return request({
        url: "/api/user/passwordcheck",
        method: "POST",
        data: {
            userId,
            loginPwd,
        },
    });
}