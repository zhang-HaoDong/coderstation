import request from "./request";

// 获取一篇文章文章的评论
export function getIssueCommentById(id, params) {
    return request({
        url: `/api/comment/issuecomment/${id}`,
        method: 'GET',
        params: {
            ...params
        }
    })
}

// 提交评论
export function addComment(comment){
    return request({
        url:'/api/comment',
        method:'POST',
        data:comment
    })
}

//获取一本书籍的评论
export function getBookCommentById(id,params){
    return request({
        url:`/api/comment/bookcomment/${id}`,
        method:'GET',
        params:{
            ...params
        }
    })
}