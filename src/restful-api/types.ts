import { AxiosRequestConfig } from 'axios'

export interface LoginInfo {
  accessToken: string
}

export interface AuthProviderIfc {
  getUserData(options?: { force: boolean }): Promise<any>
  login(params: Record<string, any>): Promise<void>
  isLogin(): boolean
  logout(): Promise<void>
}

export interface RestfulApiOptions {
  authProvider?: AuthProviderIfc
}
// eslint-disable-next-line
export interface RequestConfig extends AxiosRequestConfig {}

export interface RequestProviderIfc {
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>
  get<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>
}

export interface RequestError {

  /**
   * 错误类型
   */
  type: 'biz' | 'sys' | 'network'

  /**
   * 错误码
   */
  code: string

  /**
   * 错误文案
   */
  message: string
}

export interface ResponeData {
  code: string
  message: string
  data: any
}

export interface DefaultUserData {
  accountIcon: string
  accountId: string
  email: string
  emailVerified: number
  mobile: string
  mobileCountry: string
  mobileVerified: string
  nickname: string
  site: string
  status: number
  role: any
}
