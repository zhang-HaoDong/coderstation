import { useParams, useNavigate } from '@umijs/max'
import { useEffect, useState } from 'react';
import { getUserById, updateUserById } from '../../services/user'
import { PageContainer } from '@ant-design/pro-components'
import UserForm from './component/UserForm'
import { message } from 'antd';
export default function EditUser() {
    //获取用户的id
    const { id } = useParams();
    const navigate = useNavigate()
    //存储用户的数据
    const [userInfo, setUserInfo] = useState({})
    //根据id获取用户的数据
    useEffect(() => {
        (async () => {
            try {
                const { data } = await getUserById(id);
                setUserInfo(data);
            } catch {
                message.error('该用户不存在')
            }
        })()
    }, [id])
    // 提交用户编辑信息
    function onsubmit() {
        updateUserById(id, {
            ...userInfo
        })
        message.success('编辑用户成功')
        navigate('/user/userlist')
    }
    return (
        <>
            <PageContainer>
                <div style={{ width: 600 }}>
                    <UserForm
                        type='edit'
                        userInfo={userInfo}
                        updateUserinfo={setUserInfo}
                        onsubmit={onsubmit}
                    />
                </div>
            </PageContainer>
        </>
    )
}
