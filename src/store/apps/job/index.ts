// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL_PREFIX

// axios.defaults.headers['lng'] = 'zh_CN'

if (typeof window !== 'undefined') {
  const realAccessToken = window.localStorage.getItem(authConfig.storedRealAccessToken)!
  if (realAccessToken) {
    axios.defaults.headers['Authorization'] = realAccessToken
  }
}

import {
  GET_STANDARD_JOB_SCOPE_LIST,
  GET_JOB_TITLE_LIST,
  GET_CUSTOM_JOB_SCOPE_LIST,
  DELETE_JOB_SCOPE_DESC,
  SAVE_JOB_SCOPE_DESC,
  GET_JOB_SCOPE_DESC,
  GET_STANDARD_JOB_SCOPE_DESC
} from 'src/apis/job'

interface DataParams {
  title?: string
  keywords?: string
  orgId?: string
}

interface SaveDataParams {
  code?: string
  orgId?: string
  jobTitles?: {bizType?: string, lng?: string, content?: string}[]
  descriptions?: {bizType?: string, lng?: string, content?: string}[]
  title?: string
  descn?: string
}

interface DeleteDataParams {
  jobId?: string
  orgId?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch JobTitle
export const fetchJobTitle = createAsyncThunk('job/fetchJobTitle', async (params: DataParams) => {
  const response = await axios.get(GET_JOB_TITLE_LIST, {
    params
  })

  return response.data
})

// ** Fetch JobScope
export const fetchJobScope = createAsyncThunk('job/fetchJobScope', async (params: DataParams) => {
  const response = await axios.get(GET_STANDARD_JOB_SCOPE_LIST, {
    params
  })

  return response.data
})

// ** Fetch custom JobScope
export const fetchCustomJobScope = createAsyncThunk('job/fetchCustomJobScope', async (params: DataParams) => {
  const response = await axios.get(GET_CUSTOM_JOB_SCOPE_LIST, {
    params
  })

  return response.data
})

// ** Save custom JobScope
export const saveCustomJobScope = createAsyncThunk('job/saveCustomJobScope', async (data: SaveDataParams) => {
  const response = await axios.post(SAVE_JOB_SCOPE_DESC, data)

  return response.data
})

// ** Delete custom JobScope
export const deleteCustomJobScope = createAsyncThunk('job/deleteCustomJobScope', async (params: DeleteDataParams) => {
  const searchParams = new URLSearchParams(params as any)
  const response = await axios.delete(DELETE_JOB_SCOPE_DESC + '?' + searchParams)

  return response.data
})

// **Get custom JobScope
export const fetchStandardCustomJobDesc = createAsyncThunk('job/fetchStandardCustomJobDesc', async (params:DeleteDataParams) => {
  const response = await axios.get(GET_STANDARD_JOB_SCOPE_DESC, {
    params
  })

  return response.data
})

// **Get custom JobScope
export const fetchCustomJobDesc = createAsyncThunk('job/fetchCustomJobDesc', async (params:DeleteDataParams) => {
  const response = await axios.get(GET_JOB_SCOPE_DESC, {
    params
  })

  return response.data
})

export const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobTitleList: {} as any,
    jobScopeList: {} as any,
    customJobScopeList: {} as any
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobTitle.fulfilled, (state, action) => {
      state.jobTitleList = action.payload.data
    })
    builder.addCase(fetchJobScope.fulfilled, (state, action) => {
      state.jobScopeList = action.payload.data
    })
    builder.addCase(fetchCustomJobScope.fulfilled, (state, action) => {
      state.customJobScopeList = action.payload.data
    })
  }
})

export default jobSlice.reducer
