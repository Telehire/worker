/**
 * 获取账单列表
 */
export const GET_BILL_LIST = '/pay/invoice/query'

/**
 * 获取收据列表
 */
export const GET_INVOICE_LIST = '/pay/receipt/page'

/**
 * 获取账单详情
 */
export const GET_BILL_DETAIL = '/pay/invoice/detail'

/**
 * 获取账单详情
 */
export const GET_TO_PAY = '/pay/invoice/to-pay'

/**
 * 添加支付方式
 */
export const ADD_PAY_WAY = '/business-entity/add-business-entity-payment'

/**
 * 根据币种和总金额获取换算后的金额
 */
export const GET_FINAL_MONEY_BY_CURRENCY_AND_TOTAL = '/pay/receipt/prepare'

/**
 * 创建最终收据
 */
export const CREATE_FINAL_INVOICE = '/pay/receipt/create'

/**
 * 将待收款收据切换成等待资金到账
 */
export const CHANGE_INVOICE_STATUS_TO_PENDING = '/pay/receipt/to-pending'

/**
 * 账单状态列表
 */
export const GET_BILL_STATUS_LIST = '/pay/invoice/list-invoice-status'

/**
 * 获取未付款账单数量
 */
export const GET_WAIT_PAY_BILL_AMOUNT = '/pay/invoice/count-unpaid'

/**
 * 获取未付款账单列表
 */
export const GET_WAIT_PAY_BILL_List = '/pay/invoice/list-unpaid'

/**
 * 获取收据详情
 */
export const GET_WAIT_PAY_INVOICE_DETAIL = '/pay/receipt/detail'
