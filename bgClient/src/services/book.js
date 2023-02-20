import { request } from '@umijs/max';

// 分页获取书籍信息
export async function getBooksByPage(params) {
    return request(`/api/book`, {
        method: 'GET',
        params
    })
}

//根据id删除数据
export async function deleteBookById(id) {
    return request(`/api/book/${id}`, {
        method: 'DELETE'
    })
}

// 添加书籍
export async function addBook(bookInfo) {
    return request('/api/book', {
        method: 'POST',
        data: {
            ...bookInfo
        }
    })
}

// 根据id获取书籍
export async function getBookById(id) {
    return request(`/api/book/${id}`, {
        method: 'GET'
    })
}

// 根据id修改书记
export async function updateBook(id, newBookInfo) {
    return request(`/api/book/${id}`, {
        method: 'PATCH',
        data: {
            ...newBookInfo
        }
    })
}