/* eslint-disable no-restricted-globals */
import RouteConfig from "."
import { Alert } from 'antd'
import needLoginPathList from './routerBeforeConfig'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function RouterBefore() {
    const navigate = useNavigate();
    const { isLogin } = useSelector(state => state.user)
    function handleClose() {
        navigate('/')
    }
    if (needLoginPathList.includes(location.pathname) && !isLogin) {
        return (<>
            <Alert
                type="warning"
                message='你好 请先登录'
                closable
                onClose={handleClose}
                style={{
                    position:"relative",
                }}
            />
        </>)
    }
    return (
        <RouteConfig />
    )
}
