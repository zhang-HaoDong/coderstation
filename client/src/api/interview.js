import request from "./request";


export function getInterviews(){
    return request({
        url:'/api/interview/interviewTitle',
        method:'GET'
    })
}

export function getInterviewById(id){
    return request({
        url:`/api/interview/${id}`,
        method:'GET'
    })
}