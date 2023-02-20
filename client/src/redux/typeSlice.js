import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTypes } from '../api/type'

export const getTypeList = createAsyncThunk(
    "type/getTypeList",
    async (_, thunkAPI) => {
        const response = await getTypes();
        thunkAPI.dispatch(initTypeList(response.data))
    }
)

const typeSlice = createSlice({
    name: 'type',
    initialState: {
        typeList: [],//存储所有的类型
        issueTypeId: 'all',
        bookTypeId: 'all'
    },
    reducers: {
        // 初始化所有状态列表
        initTypeList: (state, { payload }) => {
            state.typeList = payload;
        },
        //更改问题状态id
        updateIssueTypeId: (state, { payload }) => {
            state.issueTypeId = payload;
        },
        // 更改书籍状态id
        updateBookTypeId: (state, { payload }) => {
            state.bookTypeId = payload;
        }
    },
})
export default typeSlice;
export const { initTypeList, updateIssueTypeId, updateBookTypeId } = typeSlice.actions;