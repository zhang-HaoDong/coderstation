import { useRef, useEffect, useState } from 'react'
import { useNavigate } from '@umijs/max'
import { Form, Input, Image, Upload, InputNumber, Button, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getTypes } from '../../../services/type'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
export default function BookForm({ type, bookInfo, setBookInfo, onsubmit }) {
    const formRef = useRef();
    const editorRef = useRef();
    const navigate = useNavigate();
    const [options, setOptions] = useState([])
    //用于判断是否是第一次回填
    const [isFirst, setIsFirst] = useState(true)
    useEffect(() => {
        // 编辑时的数据回填
        if (type === 'edit' && formRef.current && isFirst && Object.getOwnPropertyNames(bookInfo).length !== 0) {
            formRef.current.setFieldsValue(bookInfo);
            editorRef.current.getInstance().setHTML(bookInfo.bookIntro)
            setIsFirst(false)
        }
        if (type === 'edit' && formRef.current) {
            formRef.current.setFieldsValue(bookInfo);
        }
    }, [bookInfo])
    useEffect(() => {
        (async () => {
            const { data } = await getTypes();
            const newData = data.map(item => {
                return {
                    value: item._id,
                    label: item.typeName
                }
            })
            setOptions(newData)
        })()
    }, [])
    // 更新新增书籍信息函数
    function updateBookInfo(val, key) {
        const newBookInfo = { ...bookInfo }
        newBookInfo[key] = val;
        setBookInfo(newBookInfo)
    }
    // 上传封面
    function handleChange(e) {
        if (e.file.status === 'done') {
            const { data } = e.file.response;
            updateBookInfo(data, 'bookPic')
        }
    }
    // 取消新增
    function cancelHandle() {
        // 跳转到书籍列表
        navigate('/book/booklist')
    }
    // 提交新增
    function onFinish() {
        //获取editor数据
        const editorVal = editorRef.current.getInstance().getHTML();
        if (editorVal === '<p><br></p>') {
            message.error('请填写书籍介绍');
            return;
        }
        onsubmit(editorVal)
    }
    return (
        <Form
            name='bookform'
            onFinish={onFinish}
            initialValues={bookInfo}
            labelAlign='right'
            ref={formRef}
            labelCol={
                {
                    span: 5,
                    offset: 0
                }
            }
        >
            {/* 书籍名称 */}
            <Form.Item
                name='bookTitle'
                label='书籍名称'
                rules={[{
                    required: true,
                    message: '未填写书籍名称'
                }]}
            >
                <Input
                    placeholder='请填写书籍名称'
                    value={bookInfo.bookTitle}
                    onChange={(e) => updateBookInfo(e.target.value, 'bookTitle')}
                />
            </Form.Item>

            {/* 封面 */}
            <Form.Item
                label='封面'
            >
                {bookInfo.bookPic ?
                    <Image
                        src={bookInfo.bookPic}
                        width={250}
                    /> : null}
            </Form.Item>

            {/* 上传封面 */}
            <Form.Item
                label='上传封面'
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    showUploadList={false}
                    action="/api/upload"
                    onChange={handleChange}
                >
                    <div>
                        <PlusOutlined />
                        <p>上传封面</p>
                    </div>
                </Upload>
            </Form.Item>

            {/* 书籍介绍 */}
            <Form.Item
                label='书籍介绍'
            >
                <Editor
                    initialValue=""
                    previewStyle="tab"
                    height="600px"
                    initialEditType="markdown"
                    useCommandShortcut={true}
                    ref={editorRef}
                />
            </Form.Item>

            {/* 下载地址 */}
            <Form.Item
                label='下载地址'
            >
                <Input
                    placeholder='请填写下载地址(选填)'
                    value={bookInfo.downloadLink}
                    onChange={e => updateBookInfo(e.target.value, 'downloadLink')}
                />
            </Form.Item>

            {/* 类型 */}
            <Form.Item
                name='typeId'
                label='书籍类型'
                rules={[{
                    required: true,
                    message: '请选择书记类型'
                }]}
            >
                <Select
                    style={{
                        width: 120,
                    }}
                    onChange={e => updateBookInfo(e, 'typeId')}
                    options={options}
                />
            </Form.Item>

            {/* 所需积分 */}
            <Form.Item
                name='requirePoints'
                label='所需积分'
                rules={[{
                    required: true,
                    message: '请输入所需积分'
                }]}
            >
                <InputNumber
                    value={bookInfo.requirePoints}
                    onChange={e => updateBookInfo(e, 'requirePoints')}
                />
            </Form.Item>
            <Form.Item
                style={{
                    marginLeft: 348
                }}
            >
                <Space wrap size='large'>
                    <Button htmlType='submit' type="primary">
                        {type === 'add' ? '添加' : '修改'}
                    </Button>
                    <Button htmlType='button' type="default" onClick={cancelHandle}>
                        取消
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
