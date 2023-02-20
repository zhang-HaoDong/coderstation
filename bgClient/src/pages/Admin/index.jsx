import { useEffect, useState } from 'react'
import { Tag, Switch, Button, Popconfirm, message, Modal } from 'antd'
import { useDispatch, useSelector, useModel } from '@umijs/max'
import { ProTable, PageContainer } from '@ant-design/pro-components';
import AdminForm from './component/AdminForm'
export default function Admin() {
  const dispath = useDispatch();
  // 获取所有管理员数据
  const { adminList } = useSelector(state => state.admin);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [curEditAdminInfo, setCurEditAdminInfo] = useState({})
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    dispath({
      type: 'admin/_initAdminList'
    });
  }, [])
  //控制管理员状态
  function onChange(checked, adminInfo) {
    dispath({
      type: 'admin/_updateAdmin',
      payload: {
        adminId: adminInfo._id,
        newInfo: {
          enabled: checked
        }
      }
    })
    checked ? message.success('管理员状态已激活') : message.warning('管理员状态已禁用')
  }
  // 编辑管理员
  function editAdmin(curEditAdmin) {
    setCurEditAdminInfo(curEditAdmin)
    setIsModalOpen(true);
  }
  /**
   * 删除管理员
   * @param {Number} id 管理员ID 
   */
  function deleteAdmin(id) {
    // 需要判断是否是当前登陆的用户  是则无法删除


    // 删除管理员
    dispath({
      type: 'admin/_deleteAdmin',
      payload: id
    })
    message.success('成功删除管理员')
  }
  /**
   * 编辑提交后的操作
   */
  function editSubmit() {
    // 根据用户id更改用户数据
    dispath({
      type: 'admin/_updateAdmin',
      payload: {
        adminId: curEditAdminInfo._id,
        newInfo: {
          ...curEditAdminInfo
        }
      }
    })
    // 关闭模态框
    setIsModalOpen(false);
    message.success('修改管理员数据成功')
  }

  const columns = [
    {
      title: '登陆账号',
      dataIndex: 'loginId',
      key: 'loginId',
      align: 'center'
    },
    {
      title: '登陆密码',
      dataIndex: 'loginPwd',
      key: 'loginPwd',
      align: 'center'
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      valueType: 'image'
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      align: 'center',
      render: function (text) {
        return text === 1 ? <Tag color="volcano">超级管理员</Tag> : <Tag color="blue">普通管理员</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      // 判读是否是当前管理员 如果是 则不渲染switch组件
      render: (text, row) => {
        if(initialState.adminInfo._id === row._id)
        return <Tag color="volcano">&nbsp;-&nbsp; </Tag>
        return <Switch checked={text} onChange={(checked) => onChange(checked, row)} key={row._id} size='small' />
      }
    },
    {
      title: '操作',
      width: 150,
      key: 'option',
      align: 'center',
      render: (_, row) => (<>
        <Button type="link" size='small' key={row._id} onClick={() => editAdmin(row)}>编辑</Button>
        <Popconfirm
          title="是否确定删除此管理员"
          onConfirm={() => deleteAdmin(row._id)}
          okText="删除"
          cancelText="取消"
        >
          <Button type="link" size='small' key={row._id}>删除</Button>
        </Popconfirm>
      </>)

    },
  ]
  return (
    <PageContainer>
      <ProTable
        headerTitle='管理员列表'
        dataSource={adminList}
        rowKey={(row) => row._id}
        columns={columns}
        search={false}
        pagination={{
          pageSize: 5
        }}
      />
      <Modal title="修改管理员信息" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={550}>
        <AdminForm
          type='edit'
          adminInfo={curEditAdminInfo}
          setAdminInfo={setCurEditAdminInfo}
          onsubmit={editSubmit}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </PageContainer>
  )
}
