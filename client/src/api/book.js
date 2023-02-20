import request from "./request";

// 分页获取书籍
export function getBooksByPage(params){
    return request({
        url:'/api/book',
        method:'GET',
        params:{
            ...params
        }
    })
}

//根据id获取书籍信息
export function getBookById(bookId){
    return request({
        url:`/api/book/${bookId}`,
        method:'GET'
    })
}

//更新书籍信息
export function updateBookInfo(id,params){
    return request({
        url:`/api/book/${id}`,
        method:'PATCH',
        data:{
            ...params
        }
    })
}