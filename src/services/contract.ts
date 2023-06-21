import restfulApi from '@/restful-api'
import { ContractParams } from '@/types/biz/contract'

/**
 * 创建合同2.1 保存员工信息（STAFF）
 */
export const getUserData = (params: ContractParams): Promise<void> =>
  restfulApi.post('/contract/save-eor-contract', params)
