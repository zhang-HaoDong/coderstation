import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  dva: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Code Station',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
      access:'normalAdmin'
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      icon: 'HomeOutlined',
      access:'normalAdmin'
    },
    {
      name: '管理员',
      path: '/admin',
      icon: 'UserOutlined',
      access:'superAdmin',
      routes: [
        {
          name: '管理员列表',
          path: 'adminlist',
          component: './Admin',
          access:'superAdmin',
        },
        {
          name: '新增管理员',
          path: 'addadmin',
          component: './Admin/AddAdmin',
          access:'superAdmin',
        },
      ],
    },
    {
      name: '用户',
      path: '/user',
      icon: 'TeamOutlined',
      access:'normalAdmin',
      routes: [
        {
          name: '用户列表',
          path: 'userlist',
          component: './User',
          access:'normalAdmin'
        },
        {
          name: '新增用户',
          path: 'adduser',
          component: './User/AddUser',
          access:'normalAdmin'
        },
        {
          name: '编辑用户',
          path: 'edituser/:id',
          component: './User/EditUser',
          access:'normalAdmin',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '书籍',
      path: '/book',
      icon: 'ReadOutlined',
      access:'normalAdmin',
      routes: [
        {
          name: '书籍列表',
          path: 'booklist',
          component: './Book',
          access:'normalAdmin'
        },
        {
          name: '新增书籍',
          path: 'addbook',
          component: './Book/AddBook',
          access:'normalAdmin'
        },
        {
          name: '编辑书籍',
          path: 'editbook/:id',
          component: './Book/EditBook',
          hideInMenu:true,
          access:'normalAdmin'
        }
      ],
    },
    {
      name: '面试题',
      path: '/interview',
      icon: 'ProfileOutlined',
      access:'normalAdmin',
      routes: [
        {
          name: '面试题',
          path: 'interviewlist',
          component: './Interview',
          access:'normalAdmin'
        },
        {
          name: '新增面试题',
          path: 'addinterview',
          component: './Interview/AddInterview',
          access:'normalAdmin'
        },
        {
          name: '编辑面试题',
          path: 'editinterview/:id',
          component: './Interview/EditInterview',
          access:'normalAdmin',
          hideInMenu: true,
        },
        {
          name: '面试题详情',
          path: 'interviewdetail/:id',
          component: './Interview/InterviewDetail',
          hideInMenu: true,
          access:'normalAdmin'
        },
      ],
    },
    {
      name: ' 问答',
      path: '/issue',
      icon: 'ProfileOutlined',
      component: './Issue',
      access:'normalAdmin'
    },
    {
      name: ' 问答详情',
      path: '/issue/issuedetail/:id',
      component: './Issue/IssueDetail',
      hideInMenu: true,
      access:'normalAdmin'
    },
    {
      name: '评论',
      path: '/comment',
      component: './Comment',
      icon: 'CommentOutlined',
      access:'normalAdmin'
    },
    {
      name: '类型',
      path: '/type',
      component: './Type',
      icon: 'TagsOutlined',
      access:'normalAdmin'
    },
    {
      path:'/login',
      component:'./Login',
      menuRender: false,
    }
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
    '/static': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
    '/res': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
  },
});
