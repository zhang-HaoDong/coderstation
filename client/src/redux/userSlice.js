import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserInfo } from "../api/user";
import md5 from 'md5'

/**
 * 异步 thunk，外部在进行 dispatch 的时候，直接 dispatch 这个函数
 */
export const updateUser = createAsyncThunk(
    "user/updateUserInfo",
    async (payload, action) => {
        // 发送 ajax 请求更新服务器数据
        await updateUserInfo(payload.userId, payload.newInfo);
        // 直接在这里派发 action，更新仓库数据
        // 注意下面需要到处对应的 action
        action.dispatch(updateStoreUserInfo(payload.newInfo));
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogin: false,
        userInfo: {}
    },
    reducers: {
        initUserInfo: (state, { payload }) => {
            state.userInfo = payload;
        },
        changeLoginStatus: (state, { payload }) => {
            state.isLogin = payload;
        },
        clearUserInfo: (state) => {
            state.userInfo = {};
        },
        updateStoreUserInfo: (state, { payload }) => {
            for (let key in payload) {
                if (key === 'loginPwd') {
                    state.userInfo[key] = md5(payload[key]);
                } else {
                    state.userInfo[key] = payload[key];
                }
            }
        },
    }
})
export default userSlice;
export const { initUserInfo, changeLoginStatus, clearUserInfo, updateStoreUserInfo } = userSlice.actions;
