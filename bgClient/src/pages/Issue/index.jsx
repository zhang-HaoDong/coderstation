import { useState, useRef, useEffect } from 'react'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { getIssues, updateIssue, deleteIssue } from '../../services/issue'
import { getTypes } from '../../services/type'
import {useNavigate} from '@umijs/max'
import { Switch, Button, Popconfirm, Tag } from 'antd'
import { formatDate } from '../../utils/tools'
export default function Issue() {
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10
  })
  const [types, setTypes] = useState([])
  const actionRef = useRef();
  const navigate = useNavigate();
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  //更新问题状态
  function updateIssueStatus(e, id) {
    // 更新问题的状态
    updateIssue(id, {
      issueStatus: e
    })
    actionRef.current.reload();
  }
  useEffect(() => {
    (async () => {
      const { data } = await getTypes();
      setTypes(data)
    })()
  }, [])
  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      search: false,
      render: (text, row, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: '问题名称',
      dataIndex: 'issueTitle',
      align: 'center'
    },
    {
      title: '类型',
      dataIndex: 'typeId',
      align: 'center',
      search: false,
      render: (text, row, index) => {
        const tagColor = colorArr[index % colorArr.length];
        const tagName = (types.find(item => item._id === text))?.typeName;
        return <Tag color={tagColor}>{tagName}</Tag>
      }
    },
    {
      title: '发布时间',
      align: 'center',
      dataIndex: 'issueDate',
      search: false,
      render: (text) => formatDate(text, 'year-time')
    },
    {
      title: '问题状态',
      align: 'center',
      dataIndex: 'issueStatus',
      search: false,
      render: (text, row) => <Switch size='small' checked={text} onChange={e => updateIssueStatus(e, row._id)} />
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      search: false,
      render: (_, row) => {
        return (<>
          <Button type="link" size='small' onClick={() => navigate(`/issue/issuedetail/${row._id}`)}>详情</Button>
          <Popconfirm
            title="是否确定删除此问题"
            onConfirm={() => { deleteIssue(row._id); actionRef.current.reload() }}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size='small'>删除</Button>
          </Popconfirm>
        </>)
      }
    }
  ]
  return (
    <PageContainer>
      <ProTable
        pagination={
          {
            ...pagination,
            onChange: (current, pageSize) => setpagination({ ...pagination, current, pageSize })
          }
        }
        request={async (params) => {
          const { data } = await getIssues(params);
          return {
            total: data.count,
            data: data.data,
            success: data.data.length > 0
          }
        }}
        actionRef={actionRef}
        columns={columns}
        rowKey={(row) => row._id}
      />
    </PageContainer>
  )
}
