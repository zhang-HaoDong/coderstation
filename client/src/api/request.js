import axios from 'axios'

const request = axios.create({
    timeout: 5000,
})
request.interceptors.request.use((request) => {
    //请求拦截
    const token = localStorage.getItem('userToken');
    if(token){
        request.headers['Authorization'] = 'Bearer ' + token;
    }
    return request;
}, (err) => {
    //错误处理
    console.log('请求出错',err);
})
request.interceptors.response.use((response) => {
    //相应拦截

    return response.data;
}, (err) => {
    //错误处理
    console.log('响应出错',err);
})
export default request;