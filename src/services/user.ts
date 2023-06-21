import restfulApi from '@/restful-api'
import { UserData } from '@/types/biz/user'

/**
 * 获取登录用户信息
 */
export const getUserData = (options?: { force: boolean }): Promise<UserData | null> => restfulApi.getUserData(options)
