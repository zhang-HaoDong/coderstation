import request from './request'

//分页获取问答列表
export function getIssuesByPage(params) {
    return request({
        url: '/api/issue/',
        method: 'GET',
        params: {
            ...params
        }
    })
}

//添加一个问答
export function addIssue(data) {
    return request({
        url: '/api/issue/',
        method: 'POST',
        data,
    })
}

// 根据id获取问答
export function getIssueDetailByID(id){
    return request({
        url:`/api/issue/${id}`,
        method:'GET'
    })
}

//更新问答
export function updateIssueInfo(id,issueInfo){
    return request({
        url:`/api/issue/${id}`,
        method:'PATCH',
        data:issueInfo
    })
}