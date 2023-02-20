import {request} from '@umijs/max'

// 根据板块获取评论
export function getCommentByType(commentType,params){
    return request(`/api/comment/${commentType}`,{
        method:'GET',
        params:{
            ...params
        }
    })
}   

// 根据id删除评论
export function deleteComment(id){
    return request(`/api/comment/${id}`,{
        method:'DELETE'
    })
}