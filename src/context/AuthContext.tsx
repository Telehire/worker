// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, SmsParams, RetrieveParams } from './types'
import restfulApi from '@/restful-api'
import { getUserData } from '@/services/user'
import jwt from 'jsonwebtoken'
import { users } from 'src/@fake-db/auth/jwt'
import { UserData } from '@/types/biz/user'
import configs from "@/restful-api/constants";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  registerBySms: () => Promise.resolve(),
  registerByEmail: () => Promise.resolve(),
  registerByEmailFinal: () => Promise.resolve(),
  sendSms: () => Promise.resolve(),
  setPwd: () => Promise.resolve(),
  retrieveByEmail: () => Promise.resolve(),
  retrieveBySms: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL_PREFIX

// axios.defaults.headers['lng'] = 'zh_CN'

if (typeof window !== 'undefined') {
  const realAccessToken = window.localStorage.getItem(authConfig.storedRealAccessToken)!
  if (realAccessToken) {
    axios.defaults.headers['Authorization'] = realAccessToken
  }
}
type Props = {
  children: ReactNode
}

const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserData | null>(null) // @TODO
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storedAccessToken)!
      if (storedToken) {
        setLoading(true)

        setLoading(false)
        const userData = window.localStorage.getItem('userData')!
        if (userData) {
          setUser({ ...JSON.parse(userData) })
        }

        /*await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/auth/login')
            }
          })*/
      } else {
        setLoading(false)
        if (router.pathname === '/') {
          return
        }
        router.replace('/auth/login')
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = params
    if (params.loginType === 'EMAIL_PASSWORD') {
      requestData.email = params.account || ''
      requestData.password = params.password || ''
      requestData.vcode = params.vcode || ''
    }
    if (params.loginType === 'MOBILE_VCODE') {
      requestData.mobileCountry = params.phoneNumber?.split(' ')?.[0]
      requestData.mobile = params.phoneNumber?.replace(requestData.mobileCountry, '').replace(/\s*/g, '')
      requestData.vcode = params.phoneVerifyCode || ''
    }

    ;(async () => {
      try {
        await restfulApi.login(requestData)
        localStorage.setItem('HasSendSms', JSON.stringify(0))
        const userData = await getUserData({ force: true })
        console.log('[DEBUG]userData:', userData)

        // @FIXME 需要去掉mock
        const ud = { ...users[0], username: userData?.nickname, ...userData }

        const accessToken = jwt.sign({ id: ud.id }, jwtConfig.secret as string, {
          expiresIn: jwtConfig.expirationTime
        })
        const response = {
          accessToken,
          userData: ud
        }
        window.localStorage.setItem(authConfig.storedAccessToken, response.accessToken)
        setUser(userData)
        window.localStorage.setItem('userData', JSON.stringify(response.userData))

        window.location.href = '/dashboards'
      } catch (e) {
        console.log('[DEBUG]userData error:', e)
        const returnUrl = router.query.returnUrl

        // 错误返回来源页
        if (returnUrl) {
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        }
        if (errorCallback) {
          errorCallback(e as any)
        }
      }
    })()

    /*
    axios
      .post(authConfig.loginEndpoint, requestData)
      .then(async res => {
        const returnUrl = router.query.returnUrl

        if (res.data.code !== 'SUCCESS') {
          // 登录失败
          if (errorCallback) errorCallback(res.data.message)

          // 错误返回来源页
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        } else {
          // 登录成功
          window.localStorage.setItem(authConfig.storedRealAccessToken, res.data.data)

          const userFetched = users[0]
          const accessToken = jwt.sign({ id: userFetched.id }, jwtConfig.secret as string, {
            expiresIn: jwtConfig.expirationTime
          })

          const response = {
            accessToken,
            userData: { ...userFetched, password: '' }
          }
          window.localStorage.setItem(authConfig.storedAccessToken, response.accessToken)

          setUser({ ...response.userData })
          window.localStorage.setItem('userData', JSON.stringify(response.userData))

          window.location.href = '/dashboards'
          //router.replace('/dashboards')
        }
      })

      .catch(err => {
        if (errorCallback) {
          errorCallback(err)
        }
      })
      */
  }

  const handleSendSms = (params: SmsParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = params
    requestData.mobileCountry = params.phoneNumber?.split(' ')?.[0]
    requestData.mobile = params.phoneNumber?.replace(requestData.mobileCountry, '').replace(/\s*/g, '')
    axios
      .post(authConfig.sendSmsEndpoint, requestData)
      .then(async response => {
        if (response.data.code === 'MOBILE_CONFLICT' && errorCallback) {
          errorCallback({ code: response.data.code, message: response.data.message })
        }
      })
      .catch(err => {
        if (errorCallback) {
          errorCallback(err)
        }
      })
  }

  const handleRetrieveBySms = (params: RetrieveParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = params
    requestData.mobileCountry = params.phoneNumber?.split(' ')?.[0]
    requestData.mobile = params.phoneNumber?.replace(requestData.mobileCountry, '').replace(/\s*/g, '')
    requestData.vcode = params.phoneVerifyCode

    delete requestData.phoneNumber
    delete requestData.phoneVerifyCode

    axios
      .post(authConfig.verifySmsEndpoint, requestData)
      .then(async res => {
        if (res.data.code !== 'SUCCESS') {
          if (errorCallback) errorCallback(res.data)
          return
        }

        const { token } = res.data.data
        window.localStorage.setItem(authConfig.storedResetToken, token)

        router.replace('/auth/forgot-password/step2')
      })
      .catch(err => {
        if (errorCallback) {
          errorCallback(err)
        }
      })
  }

  const handleRetrieveByEmail = (params: RetrieveParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = params
    requestData.email = params.email
    axios
      .post(authConfig.sendEmailEndpoint, requestData)
      .then(async res => {
        if (res.data.code !== 'SUCCESS') {
          if (errorCallback) errorCallback(res.data)
          return
        }
        router.replace('/auth/forgot-password/mail-send')
      })
      .catch(err => {
        if (errorCallback) {
          errorCallback(err)
        }
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storedAccessToken)
    ;(async () => {
      try {
        await restfulApi.logout()
      } catch (e) {}
      router.push('/auth/login')
    })()
  }

  const handleSmsRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = {}
    requestData.checkType = 'SMS'
    requestData.orgName = params.enterpriseName
    requestData.email = params.enterpriseEmail
    requestData.nickname = params.contactName
    requestData.mobileCountry = params.phoneNumber?.split(' ')?.[0]
    requestData.mobile = params.phoneNumber?.replace(requestData.mobileCountry, '').replace(/\s*/g, '')
    requestData.vcode = params.phoneVerifyCode

    axios
      .post(authConfig.registerEndpoint, requestData)
      .then(res => {
        if (res.data.code !== 'SUCCESS') {
          if (errorCallback) errorCallback(res.data)
          return
        }

        const { token } = res.data.data
        window.localStorage.setItem(authConfig.storedResetToken, token)

        router.replace('/auth/register/step2')
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const handleFinalEmailRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = {}
    requestData.checkType = 'EMAIL'
    requestData.emailId = params.emailId
    requestData.vcode = params.vcode
    requestData.password = params.password

    axios
      .post(authConfig.registerEndpoint, requestData)
      .then(res => {
        if (res.data.code !== 'SUCCESS') {
          if (errorCallback) errorCallback(res.data)
          return
        }
        const { token } = res.data.data
        window.localStorage.setItem(authConfig.storedResetToken, token)
        router.push('/auth/register/success')
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const handleEmailRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = {}
    requestData.email = params.enterpriseEmail
    requestData.template = 'CONFIRM'
    requestData.extInfo = JSON.stringify(params)
    requestData.lan = params.lan
    requestData.host = `${location.origin}/auth/register/step2/`

    axios
      .post(authConfig.sendEmailEndpoint, requestData)
      .then(res => {
        if (res.data.code !== 'SUCCESS') {
          if (errorCallback) errorCallback({ code: res.data.code, message: res.data.message })
          return
        }

        const { token } = res.data.data
        window.localStorage.setItem(authConfig.storedResetToken, token)

        // router.replace(`/auth/register/mail-send?email=${params.enterpriseEmail}`, )
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const handleSetPwd = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    const requestData: any = {}
    requestData.password = params.password
    requestData.type = 'RESET-PASSWORD'

    const storedResetToken = window.localStorage.getItem(authConfig.storedResetToken)!

    if (storedResetToken) {
      requestData.token = storedResetToken
      axios
        .post(authConfig.resetPwdEndpoint, requestData)
        .then(res => {
          if (res.data.code !== 'SUCCESS') {
            if (errorCallback) errorCallback(res.data)
            return
          }
          const cusName = localStorage.getItem('REGISTER_ENTERPRISE_NAME')
          if (cusName) {
            router.push('/auth/register/success')
          } else {
            router.replace('/auth/login')
          }

          /*        else {
            handleLogin({ account: params.phoneNumber, password: params.password })
          }*/
        })
        .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
    } else {
      if (errorCallback) errorCallback({ message: 'initialize password must after register' })
    }
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    registerBySms: handleSmsRegister,
    registerByEmail: handleEmailRegister,
    registerByEmailFinal: handleFinalEmailRegister,
    sendSms: handleSendSms,
    setPwd: handleSetPwd,
    retrieveBySms: handleRetrieveBySms,
    retrieveByEmail: handleRetrieveByEmail
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
