import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import InterviewForm from './component/InterviewForm'
import { useParams,useNavigate } from '@umijs/max'
import {getInterviewById,updateInterview} from '../../services/interview'
import { message } from 'antd'
export default function EditInterview() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [interviewInfo, setInterviewInfo] = useState({})
    useEffect(()=>{
        (async ()=>{
            const {data} = await getInterviewById(id);
            setInterviewInfo(data)
        })()
    },[])
    // 提交表单数据
    function onsubmit(editorVal){
        updateInterview(id,{
            ...interviewInfo,
            interviewContent:editorVal
        })
        message.success('修改成功');
        navigate('/interview/interviewlist')
    }
    return (
        <PageContainer>
            <InterviewForm
                type='edit'
                interviewInfo={interviewInfo}
                setInterviewInfo={setInterviewInfo}
                onsubmit={onsubmit}
            />
        </PageContainer>
    )
}
