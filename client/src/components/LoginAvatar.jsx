import React from 'react'

import { Button, List, Popover, Avatar, Image } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { changeLoginStatus, clearUserInfo } from '../redux/userSlice'

import styles from '../css/LoginAvatar.module.css'
export default function LoginAvatar(props) {
    const { isLogin, userInfo } = useSelector(res => res.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleListClick(item) {
        if (item === '个人中心') {
            //跳转到个人中心
            navigate('/personal')
        }
        if (item === '退出登陆') {
            //清除token和仓库数据
            localStorage.removeItem('userToken')
            dispatch(changeLoginStatus(false))
            dispatch(clearUserInfo())
            navigate('/')
        }
    }

    let loginStatus = null;
    if (isLogin) {
        // 登陆状态
        const content = (
            <List
                dataSource={['个人中心', '退出登陆']}
                size='large'
                renderItem={item =>
                    <List.Item style={{ cursor: 'pointer' }} onClick={() => {
                        handleListClick(item)
                    }}>{item}</List.Item>
                }
            >

            </List>
        )
        loginStatus = (
            <Popover content={content} trigger='hover' placement='bottom'>
                <div className={styles.avatarContainer}>
                    <Avatar size="large" src={<Image src={userInfo?.avatar} preview />} icon={<UserOutlined />} />
                </div>
            </Popover>
        )
    } else {
        // 非登录状态
        loginStatus = (<Button type='primary' size='large' onClick={props.handleLogin}>登陆/注册</Button>)
    }
    return (
        <div>
            {loginStatus}
        </div>
    )
}
