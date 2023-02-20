import { useRef, useState, useEffect } from 'react'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { getBooksByPage } from '@/services/book'
import { useNavigate } from '@umijs/max'
import { Button, Tag, Popconfirm, message } from 'antd';
import { formatDate } from '../../utils/tools'
import { getTypes } from '../../services/type'
import { deleteBookById } from '../../services/book'
export default function Book() {
  const formRef = useRef();
  const [types, setTypes] = useState([])
  const navigate = useNavigate();
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  useEffect(() => {
    (async () => {
      const { data } = await getTypes();
      setTypes(data)
    })()
  }, [])
  //页码改变时间
  function handlePageChange(cur) {
    setPagination({
      ...pagination,
      current: cur
    })
  }
  //根据id删除数据
  function deleteBook(id) {
    deleteBookById(id)
    message.success('删除书籍成功');
    // 重载数据
    formRef.current.reload()
  }
  // 编辑书籍信息
  function editBookInfo(bookId) {
    navigate(`/book/editbook/${bookId}`)
  }
  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      search: false,
      render: (text, row, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: '书籍名称',
      dataIndex: "bookTitle",
      align: 'center'
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
      title: '封面',
      width: 100,
      valueType: 'image',
      search: false,
      dataIndex: 'bookPic',
      align: 'center'
    },
    {
      title: '简介',
      search: false,
      dataIndex: 'bookIntro',
      render: (text) => {
        if (text.length < 30) {
          return <h5 dangerouslySetInnerHTML={{
            __html: text
          }}></h5>
        }
        else {
          return <h4 dangerouslySetInnerHTML={{ __html: text.substr(0, 15) + '······' }}></h4>
        }
      }
    },
    {
      title: '下载地址',
      dataIndex: "downloadLink",
      align: 'center',
      search: false,
      width: 500,
      render: (text) => <Button type='link' onClick={() => window.open(text)}>{text}</Button>
    },
    {
      title: '上架时间',
      dataIndex: 'onShelfDate',
      align: 'center',
      search: false,
      render: (val) => formatDate(val, 'year')
    },
    {
      title: '所需积分',
      dataIndex: 'requirePoints',
      align: 'center',
      search: false,
      width: 100
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
          <Button type="link" size='small' onClick={() => editBookInfo(row._id)}>编辑</Button>
          <Popconfirm
            title="是否确定删除此书籍"
            onConfirm={() => { deleteBook(row._id) }}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size='small'>删除</Button>
          </Popconfirm>
        </>)
      }
    }
  ];
  return (
    <>
      <PageContainer>
        <ProTable
          scroll={{ x: 1500 }}
          actionRef={formRef}
          headerTitle='书籍列表'
          columns={columns}
          rowKey={(row) => row._id}
          pagination={{
            showQuickJumper: true,
            ...pagination,
            onChange: handlePageChange
          }}
          request={async (params) => {
            const data = await getBooksByPage(params);
            return {
              success: !data.code,
              data: data.data.data,
              total: data.data.count,
            }
          }}
        />
      </PageContainer>
    </>
  )
}
