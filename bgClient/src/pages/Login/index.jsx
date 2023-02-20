import { useEffect, useState } from 'react'
import styles from './index.module.css'
import ReactCanvasNest from 'react-canvas-nest';
import { Form, Button, Checkbox, Row, Col, Input, message } from 'antd'
import { UserOutlined, LockOutlined, BarcodeOutlined } from '@ant-design/icons'
import { getCaptcha, adminLogin } from '../../services/admin'
export default function Login() {
    const [loginInfo, setLoginInfo] = useState({
        loginId: '',
        loginPwd: '',
        captcha: '',
        remember: true
    })
    const [captcha, setCaptcha] = useState(null)
    // 一进来需要加载验证码
    useEffect(() => {
        captchaClickHandle()
    }, [])
    // 完成时操作
    async function onFinish() {
        const data = await adminLogin(loginInfo);
        // 分为四种情况
        // 验证码错误
        // {code: 406, msg: '验证码错误', data: null}
        if (data.code !== 0) {
            message.error(data.msg);
            captchaClickHandle();
            return;
        }
        // 密码错误或者用户不存在
        //{code: 0, msg: '', data: {data:null}}}
        if (!data.data.data) {
            message.error('用户名或密码错误');
            captchaClickHandle();
            return;
        }
        //用户冻结 无token
        // {code: 0, msg: '', data: {…}}
        if(!data.data.data.enabled){
            message.warning('该用户已冻结,请联系超级管理员');
            captchaClickHandle();
            return;
        }
        //成功登陆
        // code：0
        // data：{ data: {… }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M…U2OH0.L-Tp5QsmGnmamSirIFjDXPT1S24Ekq4z1xBmX_Z2Bis' }
        // msg:""
        localStorage.setItem('token',data.data.token);
        message.success('登陆成功');
        location.href = '/'
    }

    // 更新验证码数据
    async function captchaClickHandle() {
        const result = await getCaptcha();
        setCaptcha(result)
    }
    //更新数据
    function updateInfo(val, key) {
        const newInfo = { ...loginInfo }
        newInfo[key] = val;
        setLoginInfo(newInfo)
    }
    return (
        <div
            style={{ height: '100%' }}>
            {/* canvas动画 */}
            <ReactCanvasNest
                config={{
                    pointColor: '255,0,0',
                    count: 66,
                    follow: true
                }}
                style={{
                    zIndex: 1
                }}
            />
            {/* 登陆表单 */}
            <div className={styles.container}>
                <h1>Coder Station 后台管理系统</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={loginInfo}
                    onFinish={onFinish}
                >
                    {/* 输入账号 */}
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入账号',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="请输入账号"
                            value={loginInfo.loginId}
                            onChange={(e) => updateInfo(e.target.value, 'loginId')}
                        />
                    </Form.Item>

                    {/* 输入密码 */}
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="请输入密码"
                            value={loginInfo.loginPwd}
                            onChange={(e) => updateInfo(e.target.value, 'loginPwd')}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item
                        name="captcha"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    prefix={<BarcodeOutlined className="site-form-item-icon" />}
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) => updateInfo(e.target.value, 'captcha')}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={styles.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item name="remember" className={styles.remember}>
                        <Checkbox
                            checked={loginInfo.remember}
                            onChange={(e) => updateInfo(e.target.checked, 'remember')}
                        >
                            7天免登录
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.loginBtn}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
