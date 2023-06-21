import configs from './constants'
import { AuthProviderIfc, DefaultUserData, RequestProviderIfc } from './types'

const dataStore: {
  userData?: any
} = {}

type DefaultLoginParams = {}

interface DefaultAuthProviderProps {
  requestProvider: RequestProviderIfc
}

class DefaultAuthProvider implements AuthProviderIfc {
  requestProvider: RequestProviderIfc
  constructor(props: DefaultAuthProviderProps) {
    this.requestProvider = props.requestProvider
  }

  async getUserData(options?: { force: boolean }): Promise<DefaultUserData | null> {
    try {
      const token = window.localStorage.getItem(configs.KEY_STORED_REAL_ACCESS_TOKEN)
      if (!token) {
        return null
      }
      const storeData = dataStore.userData
      if (options?.force !== true && storeData) {
        return { ...storeData }
      }
      const data = await this.requestProvider.get<DefaultUserData>(configs.DEFAULT_USER_INFO_URL)
      dataStore.userData = data
      return { ...data }
    } catch (e) {}
    return null
  }

  /**
   * 注意这个登录只判断客户端状态
   */
  isLogin(): boolean {
    const token = window.localStorage.getItem(configs.KEY_STORED_REAL_ACCESS_TOKEN)
    const data = dataStore.userData
    return !!(token && data)
  }

  async login(params: Record<string, any>) {
    const token = await this.requestProvider.post<string>(configs.DEFAULT_LOGIN_URL, params)
    window.localStorage.setItem(configs.KEY_STORED_REAL_ACCESS_TOKEN, token)
  }

  async logout() {
    window.localStorage.removeItem(configs.KEY_STORED_REAL_ACCESS_TOKEN)
    delete dataStore.userData
  }
}

export default DefaultAuthProvider
