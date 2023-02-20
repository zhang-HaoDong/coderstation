import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import InterviewForm from './component/InterviewForm'
import {addInterview} from '../../services/interview'
import { message } from 'antd';
import {useNavigate} from '@umijs/max'
export default function AddInterview() {
  const [interviewInfo, setinterviewInfo] = useState({});
  const navigate = useNavigate()
  // 提交表单操作
  function onsubmit(editorVal) {
    addInterview({
      ...interviewInfo,
      interviewContent:editorVal
    })
    message.success('添加面试题成功');
    navigate('/interview/interviewlist')
  }
  return (
    <>
      <PageContainer>
        <div style={{
          width:800
        }}>
        <InterviewForm
          type='add'
          interviewInfo={interviewInfo}
          setInterviewInfo={setinterviewInfo}
          onsubmit={onsubmit}
        />
        </div>
      </PageContainer>
    </>
  )
}
