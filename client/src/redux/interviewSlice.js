import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getInterviews } from '../api/interview'
export const getInterview = createAsyncThunk('interview/', async (_,chunkAPI) => {
    const {data} = await getInterviews()
    chunkAPI.dispatch(initInterview(data))
})

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        interview: []
    },
    reducers: {
        initInterview: (state, { payload }) => {
            state.interview = payload;
        }
    }
})
export default interviewSlice;
export const {initInterview} = interviewSlice.actions;