import { useEffect, useState } from 'react'
import { useParams } from '@umijs/max'
import { getInterviewById } from '../../services/interview'
import { PageContainer } from '@ant-design/pro-components'
import {getTypes} from '../../services/type'
import { Card, Tag } from 'antd'
export default function InterviewDetail() {
    const { id } = useParams();
    const [interviewInfo, setInterviewInfo] = useState({})
    const [types, setTypes] = useState([])
    useEffect(() => {
        (async () => {
            const { data } = await getInterviewById(id);
            setInterviewInfo(data)
        })()
    }, [])
    useEffect(()=>{
        (async ()=>{
            const {data} = await getTypes();
            setTypes(data)
        })()
    },[])
    let typeName = null;
    if(types.length > 0){
        const findType = types.find(item=>item._id===interviewInfo.typeId);
        typeName = findType?.typeName
    }
    return (
        <PageContainer>
            <Card
                title={interviewInfo?.interviewTitle}
                style={{
                    marginBottom: 10,
                }}
                extra={
                    <Tag color="purple" key={interviewInfo?.typeId}>
                        {typeName}
                    </Tag>
                }
            >
                <div
                className='detailcontainer'
                    dangerouslySetInnerHTML={{ __html: interviewInfo?.interviewContent }}
                ></div>
            </Card>
        </PageContainer>
    )
}
