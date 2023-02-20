import React from 'react';
import ReactDOM from 'react-dom/client';

// 导入根组件
import App from './App';

//使用路由模式history
import { BrowserRouter } from 'react-router-dom'

//导入仓库
import { Provider } from 'react-redux'
import store from './redux/store'
// 导入antd中文包
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd'

//导入css
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
);
