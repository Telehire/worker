// todo: 后面慢慢从屎山里面把枚举值一个个提出来

type paymentTypeInter = 'BANK' | 'ALIPAY' | 'WECHAT' | 'VIRTUALCOIN'

interface payWayMapInterface {
  [key: string]: {
    paymentType: paymentTypeInter
    name: string
    desc: string
    service: string
    serviceCharge: string
    url: string
  }
}

export const payWayMap: payWayMapInterface = {
  BANK: {
    paymentType: 'BANK',
    name: '银行转账',
    desc: '从你的银行线下转账',
    service: 'service',
    serviceCharge: '5.00',
    url: ''
  },
  ALIPAY: {
    paymentType: 'ALIPAY',
    name: '支付宝',
    desc: '支付宝企业账号',
    service: 'no',
    serviceCharge: '',
    url: ''
  },
  WECHAT: {
    paymentType: 'WECHAT',
    name: '微信',
    desc: '微信企业账号',
    service: 'no',
    serviceCharge: '',
    url: ''
  },
  VIRTUALCOIN: {
    paymentType: 'VIRTUALCOIN',
    name: '加密货币',
    desc: '加密货币账号',
    service: '',
    serviceCharge: '',
    url: ''
  }
}
