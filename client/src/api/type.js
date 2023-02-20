import request from './request';

export function getTypes(){
    return request({
        url:'/api/type',
        method:'GET'
    })
}