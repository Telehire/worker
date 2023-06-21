import axios from 'axios'
import configs from './constants'
import misc from '@/utils/misc'
import {
  RequestError,
  RequestConfig,
  RestfulApiOptions,
  RequestProviderIfc,
  ResponeData,
  AuthProviderIfc,
  DefaultUserData
} from './types'
import DefaultAuthProvider from './auth'

export * from './types'

const getExtraHeaders = () => {
  const headers = {
    [configs.KEY_LANGUAGE]: 'zh_CN'
  }
  if (misc.isBrowser()) {
    const realAccessToken = window.localStorage.getItem(configs.KEY_STORED_REAL_ACCESS_TOKEN)
    if (realAccessToken) {
      headers['Authorization'] = realAccessToken
    }
  }
  return headers
}

const getDefaultConfig = (): RequestConfig => {
  return {
    baseURL: '/api'
  }
}

export class RestfulApi implements RequestProviderIfc, AuthProviderIfc {
  props: RestfulApiOptions | undefined
  authProvider: AuthProviderIfc

  constructor(props?: RestfulApiOptions) {
    this.props = props
    this.authProvider = props?.authProvider
      ? props.authProvider
      : new DefaultAuthProvider({
          requestProvider: this
        })
  }

  /**
   * 获取登录用户数据
   * @returns
   */
  async getUserData(options?: { force: boolean }): Promise<DefaultUserData | null> {
    return this.authProvider.getUserData(options)
  }

  /**
   * 登录
   */
  async login(params: Record<string, any>): Promise<void> {
    return this.authProvider.login(params)
  }

  isLogin(): boolean {
    return this.authProvider.isLogin()
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    return this.authProvider.logout()
  }

  /**
   * post数据
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    let result: T
    try {
      const d = await axios.post<ResponeData>(url, data, {
        ...getDefaultConfig(),
        headers: { ...getExtraHeaders(), ...config?.headers },
        ...config
      })

      if (d.status !== 200) {
        const error: RequestError = {
          type: 'network',
          code: d.status + '',
          message: 'Network error'
        }
        throw error
      }

      if (d.data?.code === configs.CODE_SUCCESS) {
        // biz success
        result = d.data.data
      } else {
        const error: RequestError = {
          type: 'biz',
          code: data.code,
          message: data.message
        }
        throw error
      }
    } catch (e: any) {
      const error: RequestError = {
        type: 'sys',
        code: 'UNKNOWN_ERROR',
        message: e.message
      }
      throw error
    }
    return result
  }

  /**
   * get数据
   */
  async get<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    let result: T
    try {
      const d = await axios.get<ResponeData>(url, {
        ...getDefaultConfig(),
        headers: { ...getExtraHeaders(), ...config?.headers },
        params: data,
        ...config
      })

      if (d.status !== 200) {
        const error: RequestError = {
          type: 'network',
          code: d.status + '',
          message: 'Network error'
        }
        throw error
      }

      if (d.data?.code === configs.CODE_SUCCESS) {
        // biz success
        result = d.data.data
      } else {
        const error: RequestError = {
          type: 'biz',
          code: data.code,
          message: data.message
        }
        throw error
      }
    } catch (e: any) {
      const error: RequestError = {
        type: 'sys',
        code: 'UNKNOWN_ERROR',
        message: e.message
      }
      throw error
    }
    return result
  }
}

const defaultInstance = new RestfulApi()

export default defaultInstance
