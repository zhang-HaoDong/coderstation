import { useState, useRef } from 'react'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { getUserByPage, updateUserById, deleteUserById } from '../../services/user'
import { Switch, Button, Popconfirm, message, Modal, Descriptions, Image } from 'antd'
import { useNavigate } from '@umijs/max'
import { useAccess, Access } from '@umijs/max'
export default function User() {
  //分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userInfo, setuserInfo] = useState({})
  const formRef = useRef();
  const navigate = useNavigate();
  const access = useAccess();

  //分页时的操作
  function handlePageChange(cur) {
    setPagination({
      ...pagination,
      current: cur
    })
  }
  // 更改用户状态时操作
  function userStatusHandleChange(val, row) {
    updateUserById(row._id, {
      enabled: val
    })
    if (!val) {
      message.warning('已冻结该管理员')
    }
    if (val) {
      message.success('激活管理员成功')
    }
    //重新加载数据
    formRef.current.reload();
  }
  // 删除管理员
  function deleteUser(id) {
    deleteUserById(id)
    //重新加载数据
    message.success('删除用户成功')
    formRef.current.reload();
  }
  // 编辑管理员
  function editHandle(id) {
    navigate(`/user/edituser/${id}`);
  }
  // 查看详情
  function detailHandle(userInfo) {
    //更改当前用户信息
    setuserInfo(userInfo)
    setIsModalOpen(true)
  }
  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, row, index) => { return (pagination.current - 1) * pagination.pageSize + index + 1 },
      search: false
    },
    {
      title: '登陆账号',
      dataIndex: 'loginId',
      align: 'center'
    },
    {
      title: "登陆密码",
      dataIndex: 'loginPwd',
      align: 'center',
      search: false
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'image',
      align: "center",
      search: false
    },
    {
      title: '用户积分',
      dataIndex: 'points',
      align: 'center',
      sorter: (a, b) => (a.points - b.points),
      search: false
    },
    {
      title: '注册时间',
      dataIndex: 'registerDate',
      align: 'center',
      search: false
    },
    {
      title: '上次登陆时间',
      dataIndex: 'lastLoginDate',
      align: 'center',
      search: false
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      align: 'center',
      search: false
    },
    {
      title: 'QQ',
      dataIndex: 'qq',
      align: 'center',
      search: false
    },
    {
      title: '微信',
      dataIndex: 'wechat',
      align: 'center',
      search: false
    },
    {
      title: "状态",
      dataIndex: 'enabled',
      search: false,
      align: 'center',
      fixed: 'right',
      render: (status, row) => {
        return <Switch checked={status} onChange={(val) => userStatusHandleChange(val, row)} size='small' />
      }
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, row) => {
        return (<>
          <Button type="link" size='small' onClick={() => detailHandle(row)}>详情</Button>
          <Button type="link" size='small' onClick={() => editHandle(row._id)}>编辑</Button>
          <Access accessible={access.superAdmin}>
            <Popconfirm
              title="是否确定删除此用户"
              onConfirm={() => { deleteUser(row._id) }}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size='small'>删除</Button>
            </Popconfirm>
          </Access>
        </>)
      }
    }
  ]
  return (
    <>
      <PageContainer>
        <ProTable
          scroll={{ x: 2000 }}
          actionRef={formRef}
          headerTitle='用户列表'
          columns={columns}
          rowKey={(row) => row._id}
          pagination={{
            showQuickJumper: true,
            ...pagination,
            onChange: handlePageChange
          }}
          request={async (params) => {
            const data = await getUserByPage(params);
            return {
              success: !data.code,
              data: data.data.data,
              total: data.data.count,
            }
          }}
        />
        <Modal title="用户详情" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <Descriptions
            bordered
            size='default'
            extra={<Button type="primary" onClick={() => navigate(`/user/edituser/${userInfo._id}`)}>编辑</Button>}
          >
            <Descriptions.Item label="登陆账号" span={3} >{userInfo.loginId}</Descriptions.Item>
            <Descriptions.Item label="登陆密码" span={3}>{userInfo.loginPwd}</Descriptions.Item>
            <Descriptions.Item label="昵称" span={3}>{userInfo.nickname}</Descriptions.Item>
            <Descriptions.Item label="头像" span={3}><Image src={userInfo.avatar} width={100} /></Descriptions.Item>
            <Descriptions.Item label="邮箱" span={3}>{userInfo.mail}</Descriptions.Item>
            <Descriptions.Item label="QQ" span={3}>{userInfo.qq}</Descriptions.Item>
            <Descriptions.Item label="微信" span={3}>{userInfo.wechat}</Descriptions.Item>
            <Descriptions.Item label="自我介绍" span={3}>{userInfo.intro}</Descriptions.Item>
          </Descriptions>
        </Modal>
      </PageContainer>
    </>
  )
}
