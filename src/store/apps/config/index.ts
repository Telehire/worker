// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GET_ORG_ENTITY_LIST, GET_ORG_TEAM_LIST } from 'src/apis/org'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { GET_CONFIG_WITH_LNG, GET_CONFIG_LIST_WITH_LNG, GET_CONFIG_WITH_COUNTRY } from '../../../apis'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL_PREFIX

// axios.defaults.headers['lng'] = 'zh_CN'

if (typeof window !== 'undefined') {
  const realAccessToken = window.localStorage.getItem(authConfig.storedRealAccessToken)!
  if (realAccessToken) {
    axios.defaults.headers['Authorization'] = realAccessToken
  }
}

interface DataParams {
  rgroup?: string
  rkey?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Organizations
export const fetchConfigByLng = createAsyncThunk('org/fetchConfigByLng', async (params: DataParams) => {
  const response = await axios.get(GET_CONFIG_WITH_LNG, { params })
  return response.data
})

export const fetchConfigListByLng = createAsyncThunk('org/fetchConfigListByLng', async (params: DataParams) => {
  const response = await axios.get(GET_CONFIG_LIST_WITH_LNG, { params })

  return response.data
})

export const fetchConfigListByCountry = createAsyncThunk('org/fetchConfigListByCountry', async (params: DataParams) => {
  const response = await axios.get(GET_CONFIG_WITH_COUNTRY, { params })

  return response.data
})

// 统一设置config
export const setConfig = createAsyncThunk('org/setConfig', async (data: any) => {
  return data
})

export const configSlice = createSlice({
  name: 'org',
  initialState: {
    config: {} as any,
    salaryConfig: {} as any,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchConfigByLng.fulfilled, (state, action) => {
      state.config = action.payload.data
    })
    builder.addCase(fetchConfigListByCountry.fulfilled, (state, action) => {
      state.salaryConfig = action.payload.data
    })
    builder.addCase(setConfig.fulfilled, (state, action) => {
      state.config = action.payload
    })
  }
})

export default configSlice.reducer
