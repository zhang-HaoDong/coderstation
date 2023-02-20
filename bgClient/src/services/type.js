import {request} from '@umijs/max'

// 获取所有类型
export async function getTypes(){
    return request('/api/type',{
        method:'GET'
    })
}

// 新增类型
export async function addTypes(typeName){
    return request('/api/type',{
        method:'POST',
        data:{
            typeName
        }
    })
}

// 删除类型
export async function deleteType(id){
    return request(`/api/type/${id}`,{
        method:'DELETE'
    })
}