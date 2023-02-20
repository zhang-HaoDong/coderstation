import React from 'react'

import { Modal, Radio, Form, Input, Row, Col, Button, Checkbox, message } from 'antd'

import styles from '../css/LoginForm.module.css'
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

import { getCaptcha, userIsExist, addUser, userLogin, getUserByID, updateUserInfo } from '../api/user'

import { useDispatch } from 'react-redux'
import { initUserInfo, changeLoginStatus } from '../redux/userSlice'

// 配合useImperativeHandle 使用ref转发
const LoginFormWrapper = forwardRef(LoginForm)
function LoginForm(props, ref) {

    //用于获取loginform内部的函数
    useImperativeHandle(ref, () => {
        return {
            getCaptcha: captchaClickHandle
        }
    }, [])

    //获得仓库推送函数
    const dispatch = useDispatch();
    //切换登陆/注册状态
    const [value, setValue] = useState(1)
    //登陆状态的表单数据
    const [loginId, setLoginId] = useState('');
    const [loginPwd, setLoginPwd] = useState('');
    const [captchaVal, setCaptchaVal] = useState('');
    const [remember, setRemember] = useState(false)
    const [nickname, setNickname] = useState('')
    const [captcha, setCaptcha] = useState('')
    //获取表单组件的元素
    const loginFormRef = useRef();
    const registerFormRef = useRef()
    //获取表单
    const [form] = Form.useForm();

    //获取验证码
    useEffect(() => {
        (async () => {
            captchaClickHandle()
        })()
    }, [])

    //重置表单
    function onReset() {
        form.resetFields()
    };

    //关闭弹窗并清除数据
    function handleCancel() {

        setLoginId('');
        setLoginPwd('');
        setCaptchaVal('');
        setRemember(false);
        setNickname('')
        props.closeModal();
    }

    //登陆处理
    async function loginHandle() {
        const result = await userLogin({
            loginId: loginId,
            loginPwd: loginPwd,
            remember: remember,
            captcha: captchaVal
        })
        if (result.data) {
            //1.密码不正确
            if (result.data.data === null) {
                message.error('用户密码不正确');
                captchaClickHandle();
                return;
            }
            //2.账户被冻结
            if (result.data.data.enabled === false) {
                message.warning('账户被冻结，请联系管理员');
                return;
            }
            //3。正常登陆
            //将token保存起来
            localStorage.setItem('userToken', result.data.token);
            //将用户信息存储在用户仓库
            //首先根据_id获取用户信息 并更改仓库数据
            //更改用户最后登陆时间
            const lastLoginDate = new Date().getTime()
            await updateUserInfo(result.data.data._id, {
                lastLoginDate
            })
            const userInfo = await getUserByID(result.data.data._id)
            dispatch(initUserInfo(userInfo.data));
            dispatch(changeLoginStatus(true))
            handleCancel()
        } else {
            message.error(result.msg);
            captchaClickHandle();
        }
    }

    //注册处理
    async function registerHandle() {
        const result = await addUser({
            loginId: loginId,
            nickname: loginPwd,
            captcha: captchaVal
        })
        if (result.data) {
            //注册成功 
            message.success('用户注册成功,默认密码为123456');
            //将用户数据存储在用户仓库
            dispatch(initUserInfo(result.data))
            dispatch(changeLoginStatus(true))
            //关闭当前窗口
            handleCancel();
        } else {
            message.error('验证码错误');
            captchaClickHandle();
        }
    }

    //处理验证码的显示
    async function captchaClickHandle() {
        setCaptcha(await getCaptcha())
    }

    //验证用户是否存在
    async function checkLoginIdIsExist() {
        if (loginId) {
            const { data } = await userIsExist(loginId);
            if (data) {
                return Promise.reject("该账号已存在")
            }
        }
    }
    //切换登陆注册状态
    function onChange(e) {
        captchaClickHandle()
        setLoginId('')
        setCaptcha('')
        setValue(e.target.value);
    }


    let container = null;
    if (value === 1) {
        container = (
            <div className={styles.container}>
                <Form
                    autoComplete="off"
                    onFinish={loginHandle}
                    ref={loginFormRef}
                    form={form}
                    preserve={false}
                >
                    <Form.Item
                        label="登录账号"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号",
                            },
                        ]}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        rules={[
                            {
                                required: true,
                                message: "请输入密码",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginPwd}
                            onChange={(e) => setLoginPwd(e.target.value)}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item
                        label="验证码"
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
                                    placeholder="请输入验证码"
                                    value={captchaVal}
                                    onChange={(e) => setCaptchaVal(e.target.value)}
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

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Checkbox
                            onChange={(e) => setRemember(e.target.checked)}
                            checked={remember}
                        >记住我</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            登录
                        </Button>
                        <Button type="primary" htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    } else {
        container = (
            <div className={styles.container}>
                <Form
                    autoComplete="off"
                    ref={registerFormRef}
                    onFinish={registerHandle}
                    form={form}
                >
                    <Form.Item
                        label="登录账号"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号，仅此项为必填项",
                            },
                            // 验证用户是否已经存在
                            { validator: checkLoginIdIsExist },
                        ]}
                        validateTrigger='onBlur'
                    >
                        <Input
                            placeholder="请输入账号"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户昵称"
                    >
                        <Input
                            placeholder="请输入昵称，不填写默认为新用户xxx"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
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
                                    placeholder="请输入验证码"
                                    value={captchaVal}
                                    onChange={(e) => setCaptchaVal(e.target.value)}
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

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            注册
                        </Button>
                        <Button type="primary" htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    return (
        <Modal title="注册/登陆" open={props.isShow} onCancel={props.closeModal} footer={null}>
            <Radio.Group
                className={styles.radioGroup}
                value={value}
                onChange={onChange}
                buttonStyle='solid'
            >
                <Radio.Button
                    className={styles.radioButton}
                    value={1}
                >
                    登陆
                </Radio.Button>
                <Radio.Button
                    className={styles.radioButton}
                    value={2}
                >
                    注册
                </Radio.Button>
            </Radio.Group>
            {container}
        </Modal>
    )
}

export default LoginFormWrapper;