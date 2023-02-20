import {request} from '@umijs/max'

// 获取所有的面试题
export function getInterview(params){
    return request(`/api/interview/`,{
        method:'GET',
        params:{
            ...params
        }
    })
}

// 根据id删除面试题
export function deleteInterviewById(id){
    return request(`/api/interview/${id}`,{
        method:'DELETE'
    })
}

// 添加一个面试题
export function addInterview(interviewInfo){
    return request(`/api/interview`,{
        method:'POST',
        data:{
            ...interviewInfo
        }
    })
}

// 根据id获取面试题数据
export function getInterviewById(id){
    return request(`/api/interview/${id}`,{
        method:'GET'
    })
}

// 根据id修改面试题
export function updateInterview(id,newInfo){
    return request(`/api/interview/${id}`,{
        method:'PATCH',
        data:{
            ...newInfo
        }
    })
}