import { useState } from 'react'

import LoginAvatar from "./LoginAvatar"

import { useNavigate } from 'react-router-dom'

import { NavLink } from 'react-router-dom'
import { Input, Select } from 'antd'

const { Option } = Select;
export default function NavHeader(props) {
  const [searchOption, setSearchOption] = useState('issue');
  const navigate = useNavigate()
  function handleSearch(value) {
    if (value === '') {
      // 值为空 跳转会首页
      navigate('/')
    } else {
      // 值不为空 进行搜索
      navigate('/searchpage', {
        state: {
          value,
          searchOption
        }
      })
    }
  }
  function onChange(value) {
    setSearchOption(value)
  }
  return (
    <div className='headerContainer'>
      {/* 头部logo */}
      <div className="logoContainer">
        <div className="logo"></div>
      </div>
      {/* 头部导航 */}
      <nav className="navContainer">
        <NavLink to='/' className='navigation'>问答</NavLink>
        <NavLink to='/books' className='navigation'>书籍</NavLink>
        <NavLink to='/interviews' className='navigation'>面试题</NavLink>
        <a href='https://ke.qq.com/' target='_blank' rel='noreferrer' className='navigation'>视频教程</a>
      </nav>
      {/* 搜索框 */}
      <div className="searchContainer">
        <Input.Group>
          <Select defaultValue="issue" size='large' style={{ width: '20%' }} onChange={onChange}>
            <Option value="issue">问答</Option>
            <Option value="book">书籍</Option>
          </Select>
          <Input.Search
            placeholder="请输入要搜索的内容"
            allowClear
            enterButton='搜索'
            size='large'
            style={{ width: '80%' }}
            onSearch={handleSearch}
          />
        </Input.Group>
      </div>
      {/* 登录按钮 */}
      <div className="loginBtnContainer">
        <LoginAvatar handleLogin={props.handleLogin}></LoginAvatar>
      </div>
    </div>
  )
}
