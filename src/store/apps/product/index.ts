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
  GET_PRODUCT_LIST_SUPPLIERS,
  GET_PRODUCT_LIST_PRODUCTS
} from 'src/apis/product'

interface DataParams {
  country?: string
  productType?: string
  orgId?: string
  city?: string
}

interface ProductParams {
  country?: string
  productType?: string
  supplierId?: string
  city?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Supplies
export const fetchProductListSuppliers = createAsyncThunk('product/fetchProductListSuppliers', async (params: DataParams) => {
  const response = await axios.get(GET_PRODUCT_LIST_SUPPLIERS, {
    params
  })

  return response.data
})

export const fetchProductListProducts = createAsyncThunk('product/fetchProductListProducts', async (params: ProductParams) => {
  const response = await axios.post(GET_PRODUCT_LIST_PRODUCTS, params)

  return response.data
})


export const productSlice = createSlice({
  name: 'product',
  initialState: {
    productListSuppliers: {} as any,
    productListProducts: {} as any,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProductListSuppliers.fulfilled, (state, action) => {
      state.productListSuppliers = action.payload.data
    })
    builder.addCase(fetchProductListProducts.fulfilled, (state, action) => {
      state.productListSuppliers = action.payload.data
    })
  }
})

export default productSlice.reducer
