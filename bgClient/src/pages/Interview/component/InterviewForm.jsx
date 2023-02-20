import { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Select } from 'antd'
import { useNavigate } from '@umijs/max'
import { getTypes } from '../../../services/type'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
export default function InterviewForm({ type, interviewInfo, setInterviewInfo, onsubmit }) {
    const formRef = useRef();
    const editorRef = useRef();
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [isFirst, setIsFirst] = useState(true)
    // 获取类型数据
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
    // 编辑时数据回填
    useEffect(() => {
        if (isFirst && formRef.current && type === 'edit' && Object.getOwnPropertyNames(interviewInfo).length !== 0) {
            editorRef.current.getInstance().setHTML(interviewInfo.interviewContent)
            formRef.current.setFieldsValue(interviewInfo)
            setIsFirst(false)
        }
        if (type === 'edit' && formRef.current) {
            formRef.current.setFieldsValue(interviewInfo);
        }
    }, [interviewInfo])
    // 提交表单数据
    function onFinish() {
        const editorVal = editorRef.current.getInstance().getHTML();
        onsubmit(editorVal)
    }
    // 更新面试题数据
    function updateInfo(val, key) {
        const newInfo = { ...interviewInfo };
        newInfo[key] = val;
        setInterviewInfo(newInfo)
    }
    //取消提交表单数据
    function cancelHandle() {
        navigate('/interview/interviewlist')
    }
    return (
        <Form
            name='interviewform'
            onFinish={onFinish}
            initialValues={interviewInfo}
            labelAlign='right'
            ref={formRef}
            labelCol={
                {
                    span: 5,
                    offset: 0
                }
            }
        >
            {/* 面试题目 */}
            <Form.Item
                name='interviewTitle'
                label='面试题目'
                rules={
                    [
                        {
                            required: true,
                            message: '请填写面试题目'
                        }
                    ]
                }
            >
                <Input
                    value={interviewInfo.interviewTitle}
                    onChange={e => updateInfo(e.target.value, 'interviewTitle')}
                />
            </Form.Item>

            {/* 类型 */}
            <Form.Item
                name='typeId'
                label='面试题类型'
                rules={[{
                    required: true,
                    message: '请选择面试题类型'
                }]}
            >
                <Select
                    style={{
                        width: 120,
                    }}
                    onChange={e => updateInfo(e, 'typeId')}
                    options={options}
                />
            </Form.Item>

            {/* 类型 */}
            <Form.Item
                label='面试题内容'
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
