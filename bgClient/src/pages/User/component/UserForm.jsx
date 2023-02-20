import {useRef,useEffect} from 'react'
import {userIsExist} from '../../../services/user'
import {useNavigate} from '@umijs/max'
import { Form,Input,Button,Space,Image,Upload } from 'antd'
import {PlusOutlined} from '@ant-design/icons'
export default function UserForm({type,onsubmit,userInfo,updateUserinfo}) {
    const navigate = useNavigate()
    // 更新用户数据
    function updateInfo(val,key){
        const newUserInfo = {...userInfo};
        newUserInfo[key] = val;
        updateUserinfo(newUserInfo)
    }
    // 获取表单实例
    const formRef = useRef();
    useEffect(()=>{
        formRef.current.setFieldsValue(userInfo)
    },[userInfo])
    //表单提交
    function onFinish(){
        onsubmit()
    }
    // 验证loginId是否存在
    async function checkLoginIdIsExist(){
        const {data} = await userIsExist(userInfo.loginId);
        if(data){
            return Promise.reject('该用户已存在')
        }
    }
    // 用户头像上传操作
    function handleChange(e){
        if(e.file.status === 'done'){
            const data = e.file.response.data;
            updateInfo(data,'avatar')
        }
    }
    // 取消操作
    function cancelHandle(){
        navigate('/user/userlist')
    }
    return (
        <>
            <Form
                onFinish={onFinish}
                name='userForm'
                initialValues={userInfo}
                labelAlign='right'
                ref={formRef}
                labelCol={
                    {
                        span: 5,
                        offset: 0
                    }
                }
            >
                {/* 用户账号 */}
                <Form.Item
                    label='登陆账号'
                    name='loginId'
                    rules={
                        type==='add'?
                        [
                            {
                                required: true,
                                message: '请输入用户账号'
                            },
                            {
                                validator: checkLoginIdIsExist
                            }
                        ]:null
                    }
                    validateTrigger='onBlur'
                >
                    <Input
                        placeholder='请输入注册的用户账号'
                        disabled={type === 'edit' ? true : false}
                        value={userInfo?.loginId}
                        onChange={(e) => updateInfo(e.target.value, 'loginId')}
                    />
                </Form.Item>

                {/* 管理员密码 */}
                <Form.Item
                    label='登陆密码'
                    name='loginPwd'
                    rules={type === 'edit' ? [{
                        required: true,
                        message: '请输入管理员密码'
                    }] : []}
                >
                    <Input.Password
                        placeholder='请输入注册的用户密码 默认密码为123456'
                        value={userInfo?.loginPwd}
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
                        placeholder='请输入用户名称 用户名称默认为新用户xxx'
                        value={userInfo.nickname}
                        onChange={e => updateInfo(e.target.value, 'nickname')}
                    />

                </Form.Item>

                {/* 当前用户头像 */}
                {userInfo.avatar ?
                    <Form.Item
                        label='当前用户头像'
                    >
                        <Image
                            src={userInfo.avatar}
                            width={150}
                        />
                    </Form.Item> :
                    null
                }

                {/* 上传用户头像 */}
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

                {/* 邮箱 */}
                <Form.Item
                    label='邮箱'
                    name='mail'
                >
                    <Input
                        placeholder='请输入你的邮箱'
                        value={userInfo.mail}
                        onChange={e => updateInfo(e.target.value, 'mail')}
                    />

                </Form.Item>
                {/* qq */}
                <Form.Item
                    label='QQ'
                    name='qq'
                >
                    <Input
                        placeholder='请输入你的QQ'
                        value={userInfo.qq}
                        onChange={e => updateInfo(e.target.value, 'qq')}
                    />

                </Form.Item>
                {/* 微信 */}
                <Form.Item
                    label='微信'
                    name='wechat'
                >
                    <Input
                        placeholder='请输入你的微信'
                        value={userInfo.wechat}
                        onChange={e => updateInfo(e.target.value, 'wechat')}
                    />

                </Form.Item>

                {/* 自我介绍 */}
                <Form.Item
                    label='自我介绍'
                    name='intro'
                >
                    <Input.TextArea
                        placeholder='自我介绍(选填)'
                        value={userInfo.intro}
                        onChange={e => updateInfo(e.target.value, 'intro')}
                    />

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
        </>
    )
}
