import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import {addUser} from '../../services/user'
import UserForm from './component/UserForm'
import {useNavigate} from '@umijs/max'
import { message } from 'antd'
export default function AddUser() {
  const [userInfo, setUserInfo] = useState({})
  const navigate = useNavigate()
  function onsubmit() {
    addUser(userInfo)
    navigate('/user/userlist')
    message.success('添加用户成功')
  }
  return (
    <>
      <PageContainer>
        <div style={{
          width: 500
        }}>
          <UserForm
            userInfo={userInfo}
            updateUserinfo={setUserInfo}
            type="add"
            onsubmit={onsubmit}
          />
        </div>
      </PageContainer>
    </>
  )
}
