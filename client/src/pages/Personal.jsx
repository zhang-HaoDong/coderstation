import { useState, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import PersonalInfoItem from '../components/PersonalInfoItem'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Upload, Image, Button, Modal, Form, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { checkPasswordIsRight } from '../api/user'
import { formatDate } from '../utils/tools'
import { updateUser, clearUserInfo, changeLoginStatus } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import styles from '../css/Personal.module.css'
export default function Personal() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user)
    const navigate = useNavigate();
    const formRefBasic = useRef();
    const formRefMedia = useRef();
    const formRefIntro = useRef();
    const [avatarURL, setAvatarURL] = useState(userInfo.avatar);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('');
    const [oldPassword, setOldPassword] = useState('')
    const [editUserInfo, setEditUserInfo] = useState({
        loginPwd: "",
        nickname: userInfo.nickname,
        mail: userInfo.mail,
        qq: userInfo.qq,
        wechat: userInfo.wechat,
        intro: userInfo.intro,
    })
    // 当上传头像后的处理函数
    function handleChange(e) {
        if (e.file.status === 'done') {
            //获取上传头像的服务器地址
            const url = e.file.response.data;
            setAvatarURL(url)
        }
    }
    //上传头像
    function uploadAvatar() {
        dispatch(updateUser({
            userId: userInfo._id,
            newInfo: {
                avatar: avatarURL
            }
        }))
    }
    // 弹出编辑表单
    function showModal(title) {
        setModalTitle(title)
        setIsModalOpen(true)
    }
    function hanldeCancel() {
        setIsModalOpen(false)
        clearEdit()
    }
    // 修改状态信息
    function updateInfo(value, key) {
        setEditUserInfo({
            ...editUserInfo,
            [key]: value
        })
    }

    //判断旧密码是否正确
    async function checkPassword() {
        if (oldPassword === '' && !editUserInfo.loginPwd) {
            return;
        }
        const { data } = await checkPasswordIsRight(userInfo._id, oldPassword);
        if (!data) {
            return Promise.reject('密码不正确')
        }
    }

    function onSubmit() {
        setIsModalOpen(false)
        if (editUserInfo.nickname?.trim() === '') {
            //昵称不可为空
            message.error('用户昵称不可以为空')
            return;
        }
        if ((editUserInfo.loginPwd === '') && oldPassword === '') {
            //如果旧密码新密码都为空 直接更新昵称
            dispatch(updateUser({
                userId: userInfo._id,
                newInfo: {
                    nickname: editUserInfo.nickname,
                    mail:editUserInfo.mail,
                    qq:editUserInfo.qq,
                    wechat:editUserInfo.wechat,
                    intro:editUserInfo.intro
                }
            }))
            message.success('修改成功')
            return;
        }
        if (editUserInfo.loginPwd !== '') {
            //存在新密码
            if (oldPassword === '') {
                //旧密码为空
                message.error('请输入旧密码');
                return;
            }
            // 重新登录
            dispatch(clearUserInfo());
            dispatch(changeLoginStatus(false))
            localStorage.removeItem('userToken');
            message.warning('密码更改 请重新登陆');
            navigate('/')
        }
        // 修改y用户密码
        dispatch(updateUser({
            userId: userInfo._id,
            newInfo: {
                ...editUserInfo
            }
        }))
        clearEdit()
    }
    function clearEdit() {
        setEditUserInfo({
            loginPwd: "",
            nickname: userInfo.nickname,
            mail: userInfo.mail,
            qq: userInfo.qq,
            wechat: userInfo.wechat,
            intro: userInfo.intro,
        })
        setOldPassword('')
        formRefBasic.current?.resetFields();
        formRefMedia.current?.resetFields();
        formRefIntro.current?.resetFields();
    }
    let modalContent = null;
    switch (modalTitle) {
        case "基本信息": {
            modalContent = (
                <>
                    <Form
                        autoComplete="off"
                        initialValues={userInfo}
                        onFinish={onSubmit}
                        ref={formRefBasic}
                        name='basic'
                    >
                        {/* 登录密码 */}
                        <Form.Item
                            label="登录密码"
                            name='oldPwd'
                            rules={[
                                {
                                    validator: checkPassword
                                }
                            ]}
                            validateTrigger='onBlur'
                        >
                            <Input.Password
                                rows={6}
                                value={oldPassword}
                                placeholder="如果要修改密码，请先输入旧密码"
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Item>

                        {/* 新的登录密码 */}
                        <Form.Item
                            label="新密码"
                            name='newpassword'
                        >
                            <Input.Password
                                rows={6}
                                value={editUserInfo.loginPwd}
                                placeholder="请输入新密码"
                                onChange={(e) => updateInfo(e.target.value, 'loginPwd')}
                            />
                        </Form.Item>

                        {/* 确认密码 */}
                        <Form.Item
                            label="确认密码"
                            name='confirmpassword'
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newpassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次密码不一致'));
                                    },
                                }),
                            ]}
                            validateTrigger='onBlur'
                        >
                            <Input.Password
                                rows={6}
                                placeholder="请确认密码"
                            />
                        </Form.Item>

                        {/* 用户昵称 */}
                        <Form.Item
                            label="用户昵称"
                            name='nickname'
                        >
                            <Input
                                placeholder="昵称可选，默认为新用户"
                                value={editUserInfo.nickname}
                                onBlur={(e) => updateInfo(e.target.value, 'nickname')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>

                            <Button type="link" htmlType="reset" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>

            );
            break;
        }
        case "社交账号": {
            modalContent = (
                <>
                    <Form
                        initialValues={userInfo}
                        autoComplete="off"
                        onFinish={onSubmit}
                        name='mediaaccounts'
                        ref={formRefMedia}
                    >
                        <Form.Item
                            label="邮箱"
                            name='mail'
                        >
                            <Input
                                value={editUserInfo.mail}
                                placeholder="请填写邮箱"
                                onChange={(e) => updateInfo(e.target.value, 'mail')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="QQ号"
                            name='qq'
                        >
                            <Input
                                value={editUserInfo.qq}
                                placeholder="请填写 QQ 号"
                                onChange={(e) => updateInfo(e.target.value, 'qq')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="微信"
                            name='wechat'
                        >
                            <Input
                                value={editUserInfo.wechat}
                                placeholder="请填写微信号"
                                onChange={(e) => updateInfo(e.target.value, 'wechat')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>
                            <Button type="link" htmlType="reset" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;

        }
        case "个人简介": {
            modalContent = (
                <>
                    <Form
                        name="personalProfile"
                        initialValues={userInfo}
                        autoComplete="off"
                        onFinish={onSubmit}
                        ref={formRefIntro}
                    >
                        {/* 自我介绍 */}
                        <Form.Item
                            label="自我介绍"
                            name='introduce'
                        >
                            <Input.TextArea
                                rows={6}
                                value={editUserInfo.intro}
                                placeholder="选填"
                                onChange={(e) => updateInfo(e.target.value, 'intro')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>

                            <Button type="link" htmlType="reset" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;
        }
        default:
            break;
    }
    return (
        <>
            <PageHeader title='个人中心' />
            <div className={styles.container}>
                <div className={styles.row}>
                    {/* 基本信息 */}
                    <Card title='基本信息' extra={<div className={styles.edit}
                        onClick={() => showModal("基本信息")}
                    >编辑</div>

                    }>
                        <PersonalInfoItem info={{
                            itemName: "登录账号",
                            itemValue: userInfo.loginId,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "账号密码",
                            itemValue: "************",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "用户昵称",
                            itemValue: userInfo.nickname,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "用户积分",
                            itemValue: userInfo.points,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "注册时间",
                            itemValue: formatDate(userInfo.registerDate),
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "上次登录时间",
                            itemValue: formatDate(userInfo.lastLoginDate),
                        }} />
                        <div style={{ fontWeight: 100, height: 50 }}>当前头像：</div>
                        <Image src={userInfo.avatar} width={100} />
                        <div style={{ fontWeight: 100, height: 50 }}>上传新头像：</div>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            action="/api/upload"
                            onChange={handleChange}
                        >
                            <PlusOutlined />
                        </Upload>
                        <Button
                            type='default'
                            onClick={uploadAvatar}
                        >上传</Button>
                    </Card>
                </div>
                <div className={styles.row}>
                    <Card title="社交账号" extra={<div className={styles.edit}
                        onClick={() => showModal("社交账号")}
                        style={{
                            marginBottom: 20
                        }}
                    >编辑</div>
                    } >
                        <PersonalInfoItem info={{
                            itemName: "邮箱",
                            itemValue: userInfo.mail ? userInfo.mail : "未填写",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "QQ号",
                            itemValue: userInfo.qq ? userInfo.qq : "未填写",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "微信号",
                            itemValue: userInfo.wechat ? userInfo.wechat : "未填写",
                        }} />
                    </Card>
                </div>
                <div className={styles.row}>
                    <Card title="个人简介" extra={<div className={styles.edit}
                        onClick={() => showModal("个人简介")}
                        style={{
                            marginBottom: 20
                        }}
                    >编辑</div>
                    }>
                        <p className={styles.intro}>
                            {userInfo.intro ? userInfo.intro : "未填写"}
                        </p>
                    </Card>
                </div>
                <Modal title={modalTitle} open={isModalOpen} footer={null} onCancel={hanldeCancel}>
                    {modalContent}
                </Modal>
            </div>
        </>
    )
}
