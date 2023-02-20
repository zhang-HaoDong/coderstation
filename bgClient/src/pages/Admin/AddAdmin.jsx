import { useState } from 'react'
import {useDispatch,useNavigate} from '@umijs/max'
import { PageContainer } from '@ant-design/pro-components'
import AdminForm from './component/AdminForm'
import { message } from 'antd'
export default function Addadmin() {
  const [adminInfo, setAdminInfo] = useState({
    permission: 2
  })
  const dispatch = useDispatch()
  const navigate = useNavigate();
  //提交表单验证
  function onsubmit() {
    // 添加管理员
    dispatch({
      type:'admin/_addAdmin',
      payload:adminInfo
    })
    // 更新仓库数据
    // ！此时不需要更新仓库数据 应为跳转到管理员列表页面会自动重新初始化数据
    //跳转到管理员列表页面
    navigate('/admin/adminlist');
    message.success('新增管理员成功')
  }
  return (
    <>
      <PageContainer>
        <div style={{ width: 500 }}>
          <AdminForm
            type='add'
            adminInfo={adminInfo}
            setAdminInfo={setAdminInfo}
            onsubmit={onsubmit}
          />
        </div>
      </PageContainer>
    </>
  )
}
