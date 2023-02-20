import { useRef ,useState} from 'react'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { getTypes } from '../../services/type'
import { Button, Popconfirm, Tag, Input, message } from 'antd'
import { deleteType ,addTypes} from '../../services/type'
export default function Type() {
  const actionRef = useRef();
  const [typeName, setTypeName] = useState('');
  //添加类型
  async function addType(){
    await addTypes(typeName);
    message.success('添加成功');
    actionRef.current.reload();
    setTypeName('')
  }
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  const columns = [
    {
      title: '类型',
      dataIndex: 'typeName',
      search: false,
      align: 'center',
      render: (text, row, index) => {
        const tagColor = colorArr[index % colorArr.length];
        return <Tag color={tagColor}>{text}</Tag>
      }
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      valueType: 'option',
      fixed: 'right',
      search: false,
      render: (_, row) => {
        return (<>
          <Popconfirm
            title="是否确定删除此类型"
            onConfirm={() => { deleteType(row._id); actionRef.current.reload() }}
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
      <Input placeholder="Type" style={{ width: 200 }} value={typeName} onChange={e=>setTypeName(e.target.value)}/>
      <Button type='primary' onClick={addType}>添加</Button>
      <ProTable
        style={{
          marginTop: 50
        }}
        pagination={false}
        search={false}
        actionRef={actionRef}
        rowKey={row => row._id}
        request={async () => {
          const { data } = await getTypes();
          return {
            data: data,
            total: data.length,
            success: data.length > 0
          }
        }}
        columns={columns}
      />
    </PageContainer>
  )
}
