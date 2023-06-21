// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GET_CURRENT_USER_ORG_LIST, GET_ORG_ENTITY_LIST, GET_ORG_TEAM_LIST } from 'src/apis/org'

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

interface DataParams {
  status?: number
  orgId?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Organizations
export const fetchAllOrg = createAsyncThunk('org/fetchAllOrg', async (params: DataParams) => {
  const response = await axios.get(GET_ORG_ENTITY_LIST, { params })

  return response.data
})

// ** Fetch Teams
export const fetchAllTeam = createAsyncThunk('org/fetchAllTeam', async (params: DataParams) => {
  const response = await axios.get(GET_ORG_TEAM_LIST, { params })

  return response.data
})

// ** Fetch orgList
export const fetchCurrentOrgList = createAsyncThunk('org/fetchCurrentOrgList', async (params: {}) => {
  const response = await axios.get(GET_CURRENT_USER_ORG_LIST, { params })
  return response.data
})

// ** Set org Id
export const setOrgId = createAsyncThunk('org/setOrgId', async (data: any) => {
  return { data }
})

export const setOrgName = createAsyncThunk('org/setOrgName', async (data: any) => {
  return { data }
})

export const orgSlice = createSlice({
  name: 'org',
  initialState: {
    organizations: [],
    teams: [],
    orgId: '',
    orgName: ''
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllOrg.fulfilled, (state, action) => {
      state.organizations = action.payload.data || []
    })
    builder.addCase(fetchAllTeam.fulfilled, (state, action) => {
      state.teams = action.payload.data || []
    })
    builder.addCase(setOrgId.fulfilled, (state, action) => {
      state.orgId = action.payload.data
    })
    builder.addCase(setOrgName.fulfilled, (state, action) => {
      state.orgName = action.payload.data
    })
    builder.addCase(fetchCurrentOrgList.fulfilled, (state, action) => {
      if (action.payload.data.length) {
        state.orgId = action.payload.data[0].orgId || []
        state.orgName = action.payload.data[0].orgName
        localStorage.setItem('CURRENT_ORG_INFO', JSON.stringify(action.payload.data[0]))
      }
    })
  }
})

export default orgSlice.reducer
