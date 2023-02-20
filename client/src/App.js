import { useState,useRef,useEffect } from 'react'

import NavHeader from "./components/NavHeader";
import PageFooter from "./components/PageFooter";
import LoginForm from "./components/LoginForm";

import { Layout,message } from 'antd';
import './css/App.css'

import RouterConfig from "./router/RouterBefore"

import {changeLoginStatus,initUserInfo} from './redux/userSlice'
import {useDispatch} from 'react-redux'

import {getUserByID,getInfoByToken} from './api/user'



const { Header, Footer, Content } = Layout
function App() {
  const [isShow, setIsShow] = useState(false)
  const loginFormRef = useRef();
  const dispatch = useDispatch();

  // 初始化用户信息  根据token获取用户信息
  useEffect(() => {
    (async ()=>{
      //没有token直接返回
        if(!localStorage.getItem('userToken'))return;
        //根据token获取用户信息
        const result = await getInfoByToken();
        if(!result.data){
          // token过期，没有获取到用户信息
            message.warning(result.msg);
            localStorage.removeItem('userToken')
            return;
        }
        // token有效
        const userInfo = await getUserByID(result.data._id)
        dispatch(initUserInfo(userInfo.data));
        dispatch(changeLoginStatus(true))
    })()
}, [dispatch])
  
  /**
   * 关闭登录框
   */
  function closeModal() {
    setIsShow(false)
  }
  /**
   * 开启登录框
   */
  function handleLogin() {
    setIsShow(true);
    loginFormRef.current.getCaptcha();
  }
  return (
    <>
      <Layout>
        <Header className="header">
          <NavHeader handleLogin={handleLogin}></NavHeader>
        </Header>
        <Content className="content">
          <RouterConfig />
        </Content>
        <Footer className='footer'>
          <PageFooter></PageFooter>
        </Footer>
      </Layout>
      <LoginForm isShow={isShow} closeModal={closeModal} ref={loginFormRef} />
    </>
  );
}

export default App;
