import { request } from '@umijs/max';


//获取所有的管理员
export async function getAdminsAPI() {
    return request('/api/admin', {
        method: "GET"
    })
}

// 根据id修改管理员
export async function updateAdminAPI(id, params) {
    return request(`/api/admin/${id}`, {
        method: 'PATCH',
        data: {
            ...params
        }
    })
}

// 根据id删除管理员
export async function deleteAdminAPI(id){
    return request(`/api/admin/${id}`,{
        method:'DELETE'
    })
}

// 添加管理员
export async function addAdminAPI(adminInfo){
    return request('/api/admin',{
        method:'POST',
        data:{
            ...adminInfo
        }
    })
}

//根据loginId判断当前用户是否存在
export function existAdminAPI(loginId){
    return request(`/api/admin/adminIsExist/${loginId}`,{
        method:'GET'
    })
}

// 获取登陆验证码
export function getCaptcha(){
    return request('/res/captcha',{
        method:'GET'
    })
}

// 管理员登陆
export function adminLogin(loginInfo){
    return request('/api/admin/login',{
        method:'POST',
        data:{
            ...loginInfo
        }
    })
}

//验证token
export function whoami(){
    return request('/api/admin/whoami',{
        method:'GET'
    })
}

// 根据id查找管理员
export function getAdminById(id){
    return request(`/api/admin/${id}`,{
        method:'GET'
    })
}