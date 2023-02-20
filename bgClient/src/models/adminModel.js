import {getAdminsAPI,deleteAdminAPI,updateAdminAPI,addAdminAPI} from '../services/admin'
import md5 from 'md5'
export default {
    // 命名 
    namespace: 'admin',
    // 状态
    state: {
        adminList: [],
        adminInfo: []
    },
    // 处理同步操作
    reducers: {
        // 初始化管理员列表
        initAdminList(state,{payload}){
            const newState = {...state};
            newState.adminList = payload;
            return newState;
        },
        deleteAdmin(state,{payload}){
            const newState = {...state}
            newState.adminList = state.adminList.filter(item=>{
                return item._id !== payload
            })
            return newState;
        },
        updateAdmin(state,{payload}){
            const newState = {...state};
            newState.adminList = state.adminList.map(item=>{
                if(item._id === payload.adminId){
                    return {
                        ...item,
                        ...payload.newInfo
                    }
                }
                return item;
            })
            return newState;
        }
    },
    //处理异步操作
    effects: {
        // 初始化管理员列表
        *_initAdminList(_,{call,put}){
            const {data} = yield call(getAdminsAPI);
            yield put({
                type:'initAdminList',
                payload:data
            })
        },
        // 根据id删除某个管理员
        *_deleteAdmin({payload},{call,put}){
            // 删除数据库的数据
            yield call(deleteAdminAPI,payload);
            // 删除仓库的数据
            yield put({
                type:'deleteAdmin',
                payload
            })
        },
        // 根据id修改管理员
        *_updateAdmin({payload},{call,put}){
            //更新数据库数据
            yield call(updateAdminAPI,payload.adminId,payload.newInfo);
            // 更新仓库数据
            if(payload.newInfo.loginPwd){
                payload.newInfo.loginPwd=md5(payload.newInfo.loginPwd)
            }
            yield put({
                type:'updateAdmin',
                payload
            })
        },
        // 添加管理员
        *_addAdmin({payload},{call,put}){
            yield call(addAdminAPI,payload);
        }
    }
}