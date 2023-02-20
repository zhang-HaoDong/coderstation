import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useState, useRef, useEffect } from 'react';
import { Button, Popconfirm, Select, Tag, Radio, message, Modal } from 'antd';
import { typeOptionCreator } from '@/utils/tools';

// 请求方法
import { getCommentByType, deleteComment } from '../../services/comment';
import { getUserById } from '../../services/user';
import { getIssueById } from '../../services/issue';
import { getBookById } from '../../services/book';
import { getTypes } from '../../services/type'

function Comment() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const actionRef = useRef();

  // 类型列表
  const [typeList, settypeList] = useState([])


  // 评论详情
  const [commentInfo, setCommentInfo] = useState(null);

  // 评论类型
  const [commmentType, setCommentType] = useState(1);


  const [isModalOpen, setIsModalOpen] = useState(false);

  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null,
  });

  // 存储评论对应所有的用户
  const [userArr, setUserArr] = useState([]);

  // 存储评论对应的问答或者书籍标题
  const [titleArr, setTitleArr] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getTypes();
      settypeList(data)
    })()
  }, [commmentType])

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return [(pagination.current - 1) * pagination.pageSize + index + 1];
      },
      search: false,
    },
    {
      title: commmentType === 1 ? '问题标题' : '书籍标题',
      dataIndex: 'commentTitle',
      search: false,
      align: 'center',
      render: (_, row) => {
        const id = row.issueId ? row.issueId : row.bookId;
        const title = titleArr.find((item) => item._id === id);
        return [commmentType === 1 ? title.issueTitle : title.bookTitle];
      },
    },
    {
      title: '评论用户',
      align: 'center',
      dataIndex: 'nickname',
      search: false,
      render: (_, row) => {
        const user = userArr.find((item) => item._id === row.userId);
        return user?.nickname ? <Tag color="blue" key={row.userId}>
          {user?.nickname}
        </Tag> : <Tag color="red" key={row.userId}>
          该用户已注销
        </Tag>

      },
    },
    {
      title: '评论内容',
      align: 'center',
      dataIndex: 'commentContent',
      key: 'commentContent',
      render: (_, row) => {
        // 将问答标题进行简化
        let brief = null;
        if (row.commentContent.length > 15) {
          brief = row.commentContent.slice(0, 15) + '...';
        } else {
          brief = row.commentContent;
        }
        return (
          <h5 dangerouslySetInnerHTML={{ __html: brief }}>
          </h5>
        );
      },
    },
    {
      title: '评论分类',
      dataIndex: 'typeId',
      key: 'typeId',
      align: 'center',
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest },
        form,
      ) => {
        return (
          <Select placeholder="请选择查询分类" onChange={handleChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        );
      },
      render: (_, row) => {
        // 寻找对应类型的类型名称
        const type = typeList.find((item) => item._id === row.typeId);
        return (<Tag color="purple" key={row.typeId}>
          {type?.typeName}
        </Tag>)
          ;
      },
    },
    {
      title: '操作',
      width: 150,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, row, index, action) => {
        return [
          <div key={row._id}>
            <Button type="link" size="small" onClick={() => showModal(row)}>
              详情
            </Button>
            <Popconfirm
              title="是否要删除该条评论？"
              onConfirm={() => deleteHandle(row)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>,
        ];
      },
    },
  ];

  /**
   * 打开修改对话框
   */
  function showModal(row) {
    setCommentInfo(row);
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 删除该条问答
   * @param {*} bookInfo
   */
  function deleteHandle(commentInfo) {
    deleteComment(commentInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success('删除评论成功');
  }

  function handleChange(value) {
    setSearchType({
      typeId: value,
    });
  }

  /**
   *
   * @param {*} page 当前页
   * @param {*} pageSize 每页条数
   */
  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize,
    });
  }

  const onChange = (e) => {
    setCommentType(e.target.value);
    actionRef.current.reload(); // 再次刷新请求
  };

  return (
    <>
      {/* 评论列表 */}
      <PageContainer>
        <Radio.Group
          onChange={onChange}
          value={commmentType}
          style={{
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          <Radio.Button value={1} defaultChecked>
            问答评论
          </Radio.Button>
          <Radio.Button value={2}>书籍评论</Radio.Button>
        </Radio.Group>
        <ProTable
          headerTitle="评论列表"
          actionRef={actionRef}
          columns={columns}
          params={searchType}
          rowKey={(row) => row._id}
          onReset={() => {
            setSearchType({
              typeId: null,
            });
          }}
          pagination={{
            ...pagination,
            onChange: handlePageChange,
          }}
          request={async (params) => {
            const result = await getCommentByType(
              commmentType,
              params,
            );
            const tableData = result.data.data;

            // 获取评论所对应的用户
            // 获取评论所对应的问答或者书籍标题
            const usersArr = [];
            const titleArr = [];
            for (let i = 0; i < tableData.length; i++) {
              const { data } = await getUserById(tableData[i].userId);
              usersArr.push(data ? data : {});
              const id = tableData[i].issueId
                ? tableData[i].issueId
                : tableData[i].bookId;
              if (commmentType === 1) {
                const { data } = await getIssueById(id);
                titleArr.push(data);
              } else {
                const { data } = await getBookById(id);
                titleArr.push(data);
              }
            }
            setUserArr(usersArr);
            setTitleArr(titleArr);

            return {
              data: tableData,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !result.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result.data.count,
            };
          }}
        />
      </PageContainer>
      {/* 评论详情模态框 */}
      <Modal
        title="评论详情"
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 50 }}
        footer={false}
      >
        <h3>评论内容</h3>
        <div>
          {commmentType === 1 ? <div dangerouslySetInnerHTML={{ __html: commentInfo?.commentContent }}></div> : <div dangerouslySetInnerHTML={{ __html: commentInfo?.commentContent }}></div>}
        </div>
      </Modal>
    </>
  );
}

export default Comment;