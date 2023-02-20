import React from 'react'
import { Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function AddIssueBtn() {
    const { isLogin } = useSelector(state => state.user);
    const navigate = useNavigate();
    function handleClick() {
        if (!isLogin) {
            //未登录
            message.warning('请先登录')
            return;
        }
        //跳转到添加问答页面
        navigate('/addissue')
    }
    return (
        <Button type='primary' size='large' style={{
            width: "100%",
            marginBottom: "30px"
        }} onClick={handleClick}>我要发问</Button>
    )
}
