import { useState, useEffect, useRef } from 'react'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { getTypes } from '../../services/type'
import { getInterview, deleteInterviewById } from '../../services/interview'
import { Tag, Button, Popconfirm, message } from 'antd'
import { formatDate } from '../../utils/tools'
import {useNavigate} from '@umijs/max'
export default function Interview() {
  const actionRef = useRef()
  const navigate  = useNavigate()
  // 分页信息
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10
  })
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  const [types, setTypes] = useState([])
  useEffect(() => {
    (async () => {
      const { data } = await getTypes();
      setTypes(data)
    })()
  }, [])

  // 删除某个面试题
  function deleteInterview(id) {
    deleteInterviewById(id);
    actionRef.current.reload();
    message.success('删除成功')
  }
  //列信息
  const columns = [
    {
      title: '序号',
      search:false,
      key: 'sequence',
      align: 'center',
      render: (_, row, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: '面试题目',
      dataIndex: 'interviewTitle',
      align: "center",
      render: (text) => {
        if (text.length > 25) return text.substr(0, 25) + '···'
        return text;
      }
    },
    {
      title: '类型',
      dataIndex: 'typeId',
      align: 'center',
      search: false,
      render: (text, row, index) => {
        const tagColor = colorArr[index % colorArr.length];
        const tagName = (types.find(item => item._id === text)).typeName;
        return <Tag color={tagColor}>{tagName}</Tag>
      }
    },
    {
      title: '发布时间',
      search:false,
      dataIndex: 'onShelfDate',
      align: 'center',
      render: (text) => formatDate(text, 'year')
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
          <Button type="link" size='small' onClick={() => navigate(`/interview/interviewdetail/${row._id}`)}>详情</Button>
          <Button type="link" size='small' onClick={() => navigate(`/interview/editinterview/${row._id}`)}>编辑</Button>
          <Popconfirm
            title="是否确定删除此问题"
            onConfirm={() => { deleteInterview(row._id) }}
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
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          console.log(params)
          const { data } = await getInterview(params)
          return {
            total: data.count,
            data: data.data,
            success: data.data.length > 0
          }
        }}
        rowKey={(row) => row._id}
        pagination={
          {
            ...pagination,
            onChange: (current, pageSize) => setpagination({
              ...pagination,
              current,
              pageSize
            })
          }
        }
      />
    </PageContainer>
  )
}
