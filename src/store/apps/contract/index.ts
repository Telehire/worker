// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {GET_NEW_CONTRACT_ID, SAVE_EOR_CONTRACT, GET_CONTRACT_DETAIL, SAVE_FIXED_COST_CONTRACT} from 'src/apis/contract'

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

interface GetDataParams {
  orgId?: string
}



interface PostDataParams {
  action: string | string[]
  contractId: string
  orgId: string
  teamId?: string
  type: string
  paymentCycle?: string;
  currency?: string;
  cost?: number;
  customCycle?: boolean;
  endTime?: Date;
  paymentDeadline?: Date;
  payBeforeWeekend?: boolean;
  staff?: {
    staffMobileCountry: string
    staffMobile: string
    staffEmail: string
    staffNationality: string
    staffWorkplaceCountry: string
    staffWorkplaceState: string
    staffWorkplaceCity: string
    staffWorkVisaCode: string
  }
  jobTitle?: {
    entiryId: string
    teamId: string
    jobTitle: string
    jobDuty: string
  }
  salary?: {
    employmentType: string
    salaryCurrency: string
    salaryAmount: string
    salaryFiguredPeriod: string
    planEntryDate: number
    paidVacationType: string
    paidVacationDays: number
    contractTermType: string
    contractEndDate: number
    needProbation: boolean
    probationEndDate: number
    weeklyWorkHours: number
    signingBonus: string
    variablePay: {
      title: string
      startDay: number
      type: string
      fixedValue: string
      percentageValue: string
      period: string
      currency: string
    }
    regularAllowance: {
      title: string
      period: string
      amount: string
      currency: string
    }
  }
}

interface GetListParams{
  orgId: string;
  contractStatus?: string[];
  staffWorkplaceCountry?: string;
  keywords?: string;
  start: number;
  rows: number;
}

interface GetContractDetailProps{
  orgId: string;
  contractId: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch ContractId
export const fetchContractId = createAsyncThunk('contract/fetchContractId', async (params: GetDataParams) => {
  const response = await axios.get(GET_NEW_CONTRACT_ID, {
    params
  })

  return response.data
})

export const setContractId = createAsyncThunk('contract/setContractId', async (data: any) => {
  return data
})

// ** Save eor contract
export const saveEorContract = createAsyncThunk('contract/saveEorContract', async (data: PostDataParams) => {
  const response = await axios.post(SAVE_EOR_CONTRACT, data)

  return response.data
})

// **  Save current contract detail
export const saveContractDetail = createAsyncThunk('contract/saveContractDetail', async (data: any) => {
  return data
})

export const getContractDetailById = createAsyncThunk('contract/getContractDetailById', async (data: {orgId: string, contractId: string}) => {
  const response = await axios.get(GET_CONTRACT_DETAIL, {params: data})
  return response.data
})

export const getFixedCostContractDetailById = createAsyncThunk('contract/getFixedCostContractDetailById', async (data: {orgId: string, contractId: string}) => {
  const response = await axios.get(GET_CONTRACT_DETAIL, {params: data})
  return response.data
})

// ** Save not eor contract / fixed cost contract
export const saveFixedCostContract = createAsyncThunk('contract/saveFixedCostContract', async (data: {}) => {
  const response = await axios.post(SAVE_FIXED_COST_CONTRACT, data)
  return response.data
})


export const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    contractId: {} as any,
    contract: {} as any,
    currentContract: {} as any,
    fixedCostContract: {} as any,
    currentFixedCostContract: {} as any,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractId.fulfilled, (state, action) => {
      state.contractId = action.payload.data
    })
    builder.addCase(saveEorContract.fulfilled, (state, action) => {
      state.contract = action.payload.data
    })
    builder.addCase(saveContractDetail.fulfilled, (state, action) => {
      state.currentContract = action.payload
    })
    builder.addCase(setContractId.fulfilled, (state, action) => {
      state.contractId = action.payload
    })
    builder.addCase(getContractDetailById.fulfilled, (state, action) => {
      const tempContract = {...action.payload.data};
      tempContract.staff = Object.keys(tempContract).reduce((fin: any, v: string)=> {
        if(v.indexOf('staff')>-1) {
          fin[v] = tempContract[v]
        }
        return fin
      }, {})
      state.currentContract = {...tempContract}
    })
    builder.addCase(saveFixedCostContract.fulfilled, (state, action) => {
      state.contract = action.payload.data
      state.fixedCostContract = action.meta.arg
    })
    builder.addCase(getFixedCostContractDetailById.fulfilled, (state, action) => {
      const tempContract = {...action.payload.data};
      tempContract.staff = Object.keys(tempContract).reduce((fin: any, v: string)=> {
        if(v.indexOf('staff')>-1) {
          fin[v] = tempContract[v]
        }
        return fin
      }, {})
      state.currentFixedCostContract = {...tempContract}
    })
  }
})

export default contractSlice.reducer
