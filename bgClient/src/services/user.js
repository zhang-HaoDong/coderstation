import { request } from '@umijs/max';


//分页获取用户信息
export async function getUserByPage(params) {
    return request('/api/user/', {
        method: 'GET',
        params: {
            ...params
        }
    })
}

// 修改用户信息
export async function updateUserById(id, newInfo) {
    return request(`/api/user/${id}`, {
        method: 'PATCH',
        data: {
            ...newInfo
        }
    })
}

// 根据id删除用户
export async function deleteUserById(id) {
    return request(`/api/user/${id}`, {
        method: 'DELETE',
    })
}

// 根据loginId判断用户是否存在
export async function userIsExist(loginId) {
    return request(`/api/user/userIsExist/${loginId}`, {
        method: 'GET'
    })
}

// 添加一个用户
export async function addUser(userInfo) {
    userInfo.type = 'background'
    return request('/api/user/', {
        method: 'POST',
        data: {
            ...userInfo
        }
    })
}

// 根据id查询用户
export async function getUserById(id){
    return request(`/api/user/${id}`,{
        method:'GET'
    })
}