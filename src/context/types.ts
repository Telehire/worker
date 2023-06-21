import { DefaultUserData } from '@/restful-api'
import { UserData } from '@/types/biz/user'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  phoneNumber?: string
  phoneVerifyCode?: string
  account?: string
  password?: string
  rememberMe?: boolean
  loginType?: string
  vcode?: string
  email?: string
}

export type SmsParams = {
  phoneNumber?: string
  template?: string
  site?: string
}

export type ResetProps = {
  title?: string
  source?: string
}

export type RegisterParams = {
  enterpriseName?: string
  enterpriseEmail?: string
  contactName?: string
  phoneNumber?: string
  phoneVerifyCode?: string
  checkType?: string
  password?: string
  passwordAgain?: string
  lan?: string
  emailId?: string,
  vcode?: string,
}

export type RequestDemoParams = {
  enterpriseName?: string
  enterpriseEmail?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  enterpriseScale?: string
  requirement?: string
}

export type RetrieveParams = {
  phoneNumber?: string
  phoneVerifyCode?: string
  email?: string
  checkType?: string
  template?: string
}

// @TODO 去掉mock测试字段
export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  phoneNumber: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserData | null
  setLoading: (value: boolean) => void
  setUser: (value: UserData | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  registerBySms: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  registerByEmail: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  registerByEmailFinal: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  sendSms: (params: SmsParams, errorCallback?: ErrCallbackType) => void
  setPwd: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  retrieveBySms: (params: RetrieveParams, errorCallback?: ErrCallbackType) => void
  retrieveByEmail: (params: RetrieveParams, errorCallback?: ErrCallbackType) => void
}
