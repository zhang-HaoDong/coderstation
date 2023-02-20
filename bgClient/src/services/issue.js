import { request } from '@umijs/max'

// 获得所有问题
export async function getIssues(params) {
    return request('/api/issue/', {
        method: "GET",
        params: {
            ...params
        }
    })
}

// 根据id修改问题
export async function updateIssue(id, params) {
    return request(`/api/issue/${id}`, {
        method: 'PATCH',
        data: {
            ...params
        }
    })
}

// 根据id删除问题
export async function deleteIssue(id){
    return request(`/api/issue/${id}`,{
        method:"DELETE"
    })
}

// 根据id获取问题
export async function getIssueById(id){
    return request(`/api/issue/${id}`,{
        method:'GET'
    })
}