import { Form, Input, Button, Radio, Upload, Space, Image, message } from 'antd'
import { useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import { existAdminAPI } from '../../../services/admin'
import { useNavigate } from '@umijs/max'
export default function AdminForm({ type, adminInfo, setAdminInfo, onsubmit, setIsModalOpen }) {
    const formRef = useRef();
    useEffect(() => {
        formRef.current?.setFieldsValue(adminInfo)
    }, [adminInfo])
    const navigate = useNavigate()
    function updateInfo(value, key) {
        const newAdminInfo = { ...adminInfo };
        newAdminInfo[key] = value;
        setAdminInfo(newAdminInfo)
    }
    function handleChange(e) {
        if (e.file.status === 'done') {
            const { data } = e.file.response;
            updateInfo(data, 'avatar')
        }
    }
    function onFinish() {
        onsubmit();
    }
    async function checkLoginIdIsExist() {
        if (adminInfo.loginId && type === 'add') {
            const { data } = await existAdminAPI(adminInfo.loginId);
            if (data) {
                return Promise.reject('该账号已存在')
            }
        }
    }
    function cancelHandle() {
        if (type === 'add') {
            navigate('/admin/adminlist');
        }
        if (type === 'edit') {
            setIsModalOpen(false)
        }
    }
    return (

        <Form
            onFinish={onFinish}
            name='adminform'
            initialValues={adminInfo}
            labelAlign='right'
            ref={formRef}
            labelCol={
                {
                    span: 6,
                    offset: 0
                }
            }
        >
            {/* 管理员账号 */}
            <Form.Item
                label='登陆账号'
                name='loginId'
                rules={
                    [
                        {
                            required: true,
                            message: '请输入管理员账号'
                        },
                        {
                            validator: checkLoginIdIsExist
                        }
                    ]
                }
                validateTrigger='onBlur'
            >
                <Input
                    placeholder='请输入注册的管理员账号'
                    disabled={type === 'edit' ? true : false}
                    value={adminInfo?.loginId}
                    onChange={(e) => updateInfo(e.target.value, 'loginId')}
                />
            </Form.Item>

            {/* 管理员密码 */}
            <Form.Item
                label='登陆密码'
                name='loginPwd'
                rules={type==='edit'?[{
                    required:true,
                    message:'请输入管理员密码'
                }]:[]}
            >
                <Input.Password
                    placeholder='请输入注册的管理员密码 默认密码为123123'
                    value={adminInfo?.loginPwd}
                    onChange={(e) => updateInfo(e.target.value, 'loginPwd')}
                />

            </Form.Item>

            {/* 昵称 */}
            <Form.Item
                label='用户昵称'
                name='nickname'
                rules={type === 'edit' ? [{
                    required: true,
                    message: '请输入用户昵称'
                }] : []}
            >
                <Input
                    placeholder='请输入用户名称 用户名称默认为新增管理员'
                    value={adminInfo.nickname}
                    onChange={e => updateInfo(e.target.value, 'nickname')}
                />

            </Form.Item>

            {/* 权限 */}
            <Form.Item
                label='权限'
                name='permission'
            >
                <Radio.Group onChange={e => updateInfo(e.target.value, 'permission')} value={adminInfo.permission}>
                    <Radio value={2}>普通管理员</Radio>
                    <Radio value={1}>超级管理员</Radio>
                </Radio.Group>
            </Form.Item>

            {/* 当前用户头像 */}
            {adminInfo.avatar ?
                <Form.Item
                    label='当前用户头像'
                >
                    <Image
                        src={adminInfo.avatar}
                        width={150}
                    />
                </Form.Item> :
                null
            }

            {/* 用户头像 */}
            <Form.Item
                label='用户头像'
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
                        <p>上传头像</p>
                    </div>
                </Upload>
            </Form.Item>


            {/* 按钮 */}
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
        </Form >
    )
}
