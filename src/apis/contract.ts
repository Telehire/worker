/**
 * 获取新合同ID的接口
 */
export const GET_NEW_CONTRACT_ID = '/contract/load-new-contract-id'

/**
 * 保存合同的接口
 */
export const SAVE_EOR_CONTRACT = '/contract/save-eor-contract'

/**
 * 获取合同详情的接口
 */
export const GET_CONTRACT_DETAIL = '/contract/load-eor-contract'

/**
 * 获取合同列表
 */
export const GET_CONTRACT_LIST = '/contract/query-eor-contract'

/**
 * 获取合同状态字典
 */
export const GET_CONTRACT_STATUS_MAP = '/contract/count-eor-contract-group-by-status'

/**
 * 获取国家列表
 */
export const GET_COUNTRY_LIST = '/basic/opening/list-area'

/**
 * 根据合同类型获取合同数量
 */
export const GET_CONTRACT_COUNT_BY_TYPE = '/contract/count-contract-group-by-type'

/**
 * 获取币种列表
 */
export const GET_CURRENCY_LIST = '/basic/opening/list-all-currencies'

/**
 * 获取团队列表
 */
export const GET_TEAM_LIST = '/orgs/teams'

/**
 * 获取实体列表
 */
export const GET_ENTITY_LIST = '/orgs/entities'

/**
 * 保存附加信息
 */
export const SAVE_ADDITIONAL_INFORMATION = '/contract/save-eor-contract-profile'

/**
 * 删除附加信息
 */
export const DELETE_ADDITIONAL_INFORMATION = '/contract/delete-eor-contract-profile'

/**
 * 删除附加信息
 */
export const DELETE_CONTRACT = '/contract/delete-eor-contract'

/**
 * 获取城市地区
 */
export const GET_LOCALE_COUNTRY = '/basic/opening/list-area'

/**
 * 获取城市地区
 */
export const TO_SIGNING = '/contract/trigger-eor-contract-sign'

/**
 * 获取合同报价
 */
export const GET_CONTRACT_QUOTATION = '/contract/query-eor-contract-quotation'

/**
 * 拒绝签署合同
 */
export const REFUSE_SIGN_CONTRACT = '/contract/archive-contract'


/**
 * 保存非EOR合同 / 固定费用合同
 */
export const SAVE_FIXED_COST_CONTRACT = '/contract/save-temporary-contract-fixed-costs'

/**
 * 终止合同
 */
export const STOP_EOR_CONTRACT = '/contract/termination-contract'


/**
 * 待入职状态修改合同接口 邮件/团队
 */
export const EDIT_CONTRACT_IN_DETAIL = '/contract/update-contract'

