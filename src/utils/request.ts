import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// axios.defaults.headers.common[]

const service = axios.create({
  timeout: 100 * 1000
})

service.interceptors.request.use(
  config => {
    // 处理公共header
    // if(config && config.headers){

    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const success = response.status
    if (!success) {
      console.error(response)
      throw new Error(response.data.code)
    }
    return response
  },
  error => {
    // todo: 处理错误
    const permissionDenied = error.response?.status === 401
    if (!permissionDenied) {
      console.error(error)
    }
    // if(permissionDenied && error.response){

    // }
    return error
  }
)

interface Raise<T> {
  code: string
  msg: string
  data: T
}

interface CustomAxiosResponse<T> {
  success: true
  data: Raise<T>
  response: AxiosResponse
}

interface CustomAxiosResponseErr {
  success: false
  data?: any
}

export const request = async <T>(
  config: AxiosRequestConfig
): Promise<CustomAxiosResponse<T> | CustomAxiosResponseErr> => {
  console.log('@@aaa', config)
  try {
    const response = await service.request(config)
    console.log('@@ response = ', response)
    if (config?.responseType === 'blob') {
      return {
        success: true,
        data: response.data,
        response
      }
    }
    return {
      success: true,
      response,
      data: response.data
    }
  } catch (e) {
    return {
      success: false,
      data: null
    }
  }
}

export const paramsPost = (params: any) => {
  const paramsData = new URLSearchParams()
  Object.keys(params).forEach(key => {
    paramsData.append(key, params[key])
  })
  return paramsData
}
