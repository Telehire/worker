// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** View Imports
import VerticalSteper from '@/views/components/vertical-steper'
import Box from '@mui/material/Box'
import { Fab } from '@mui/material'
import { common } from '@mui/material/colors'
import Icon from '../../../@core/components/icon'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchContractId } from '@/store/apps/contract'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { BillPropsType, PayAccountType, PayInfoType } from 'src/types/biz/bill'
import axios from 'axios'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import TeamStep1 from './components/team-step1'
import ChoosePayWay from './components/choose-pay-way'
import QrCodePay from './components/qr-code-pay'
import BankTransfer from './components/bank-transfer'
import Dialog from '@mui/material/Dialog'
import Hidden from '@mui/material/Hidden'

import {
  GET_BILL_DETAIL,
  GET_TO_PAY,
  ADD_PAY_WAY,
  GET_FINAL_MONEY_BY_CURRENCY_AND_TOTAL,
  CREATE_FINAL_INVOICE,
  GET_WAIT_PAY_BILL_List,
  CHANGE_INVOICE_STATUS_TO_PENDING,
  GET_WAIT_PAY_INVOICE_DETAIL
} from '@/apis/payment'
import { GET_COUNTRY_LIST, GET_CURRENCY_LIST, GET_ENTITY_LIST, GET_ORG_ENTITY_LIST } from '@/apis'

// ** Styled Components
const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

interface BillMapValueType {
  currencyType: string
  currencyTypeName: string
  currencyTypeNameEn: string
  price: string
  billList: BillPropsType[]
}

const payWayMap: { [key: string]: any } = {
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
    name: '虚拟货币',
    desc: '虚拟货币账号',
    service: 'no',
    serviceCharge: '',
    url: ''
  }
}

const currencyMap: { [key: string]: any } = {
  CNY: {
    name: '人民币',
    icon: '¥'
  },
  USD: {
    name: '美元',
    icon: '$'
  }
}

const ContractCreateFullTime = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [billMap, setBillMap] = useState<BillMapValueType[]>([])
  const [params, setParams] = useState<any>({ entityId: '', currency: '', contractType: '', countryCode: '' })
  const [checkedList, setCheckedList] = useState<any>([])
  const [payWay, setPayWay] = useState<string>('')
  const [steps, setSteps] = useState<{ title: string }[]>([{ title: '选择付款方式' }, { title: '确定付款' }])
  const [waitPayMoney, setWaitPayMoney] = useState<number>(0)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [isBatch, setIsBatch] = useState<number>(1)
  const [payId, setPayId] = useState<any>('')
  const [addNewPayWay, setAddNewPayWay] = useState<boolean>(false)
  const [hasSavePayWayList, setHasSavePayWayList] = useState<any[]>([])
  const [waitSavePayWayList, setWaitSavePayWayList] = useState<any[]>([])
  const [billInfo, setBillInfo] = useState<any>({
    businessEntityId: '',
    businessEntityCurrency: '',
    commissionCharge: ''
  })
  const [accountInfo, setAccountInfo] = useState<any>({})
  const [finalBill, setFinalBill] = useState<{ money: string; currency: string; [key: string]: any }>()
  const [allDic, setAllDic] = useState<{ [key: string]: any[] }>({
    entities: [],
    contractTypeList: [],
    currencies: [],
    countries: []
  })
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: any }>({})
  const [finalInvoice, setFinalInvoice] = useState<any>({})
  const { orgId } = useSelector((state: RootState) => state.org)
  const [payInfo, setPayInfo] = useState<PayInfoType>({
    url: '',
    type: '3',
    billNum: 'S-2023-511',
    name: '杭州乐坦科技有限公司',
    accountName: '13768954723'
  })
  const theme = useTheme()
  console.log('payWay = ', payWay)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    // todo: 这里没有orgId导致页面payId为空，页面不加载
    // if(orgId) {
    if (router.query?.batch) {
      const temp = [...steps]
      if (temp[0].title !== '选择要支付的账单') temp.unshift({ title: '选择要支付的账单' })
      setSteps(temp)
      setIsBatch(0)
      getAllDic()
      getBillList()
    } else if (router.query.invoiceId) {
      getInvoideDetail(String(router.query.invoiceId))
    } else if (router.query.billId) {
      setPayId(router.query.billId)
    }
    // }
  }, [router, orgId])

  const getInvoideDetail = (id: string) => {
    axios.get(GET_WAIT_PAY_INVOICE_DETAIL, { params: { receiptId: id } }).then(res => {
      if (res.data.code === 'SUCCESS') {
        setFinalInvoice(res.data.data)
        const temp = [...steps]
        setSteps(temp.slice(0, step).concat([{ title: '确定付款账号' }, { title: '确定收款账号' }]))
        setStep(3)
        setPayWay('BANK')
      }
    })
  }

  useEffect(() => {
    if (!isBatch) {
      getBillList()
    }
  }, [params])

  useEffect(() => {
    if (payId) {
      getBillInfoById(payId)
      getBatchToPay([payId])
    }
  }, [payId])

  // 获取待支付账单列表
  const getBillList = () => {
    axios.post(GET_WAIT_PAY_BILL_List, { ...deleteEmpty(params) }).then(res => {
      console.log(res)
      const tempArr: any = []
      const currencyIndex: any = {}

      // 根据待支付账单列表获取toPay信息
      getBatchToPay(res.data.data.map((v: any) => v.invoiceId))
      Object.keys(currencyMap).forEach((v: any, index: number) => {
        currencyIndex[v] = index
        tempArr.push({
          currencyType: currencyMap[v].icon,
          currencyTypeName: currencyMap[v].name,
          currencyTypeNameEn: v,
          price: 0,
          billList: []
        })
      })
      res.data.data.forEach((v: any, index: number) => {
        tempArr[currencyIndex[v.invoiceCurrency]].billList.push(v)
        tempArr[currencyIndex[v.invoiceCurrency]].price = +Number(
          tempArr[currencyIndex[v.invoiceCurrency]].price + +Number(v.invoiceTotalValue / 1000).toFixed(2)
        ).toFixed(2)
      })
      setBillMap(tempArr)
    })
  }

  const getToPay = async (ids: string[]) => {
    return await axios.post(GET_TO_PAY, { invoiceIds: ids }).then(res => {
      return res.data.data
    })
  }

  // 根据待支付账单列表获取toPay信息
  const getBatchToPay = async (ids: string[]) => {
    const result: any = await getToPay(ids)
    console.log('result', result)

    //增加虚拟货币方式
    setExchangeRates(result.exchangeRates)
    setHasSavePayWayList(
      result.savedPayments.map((v: any) => ({
        ...payWayMap[v.paymentType],
        ...v,
        currencyIcon: currencyMap[v.currency]
      }))
    )
    setWaitSavePayWayList(
      result.supportedPaymentTypes
        .filter((v: any) => {
          return v === 'BANK' || !result.savedPayments.find((item: any) => item.paymentType === v)
        })
        .map((v: string) => payWayMap[v])
    )
    setBillInfo({
      businessEntityId: result.payEntityId,
      businessEntityCurrency: result.toCurrency,
      commissionCharge: Number(result.commissionCharge / 1000).toFixed(2),
      businessEntityCurrencyIcon: currencyMap[result.toCurrency].icon,
      entityCountry: result.entityCountry
    })
    if (isBatch) {
      // 如果不是批量选择账单，直接赋值待支付待支付列表
      const temp = {
        currencyType: currencyMap[result.toCurrency].icon,
        currencyTypeName: currencyMap[result.toCurrency].name,
        currencyTypeNameEn: result.toCurrency,
        exchangeRate: result.exchangeRates[result.toCurrency],
        money: Number(result.totalValue) / 1000,
        invoiceId: payId
      }
      setCheckedList([temp])
      setWaitPayMoney(Number(result.totalValue) / 1000)
    }
  }

  const getAllDic = () => {
    const defaultParams = {
      orgId
    }
    const getEntities = axios.get(GET_ENTITY_LIST, { params: defaultParams })
    const getContractTypeList = axios.get(GET_COUNTRY_LIST, { params: { parent: 0 } })
    const getCurrencyList = axios.get(GET_CURRENCY_LIST)
    Promise.all([getEntities, getContractTypeList, getCurrencyList]).then(res => {
      setAllDic({
        entities: res[0].data.data,
        contractTypeList: [
          { name: 'EOR 合同', value: 'EOR' },
          { name: '承包商合同', value: 'Contract' }
        ],
        currencies: res[2].data.data,
        countries: res[1].data.data
      })
    })
  }

  const deleteEmpty = (obj: any) => {
    const a: any = {}
    Object.keys(obj).forEach(v => {
      if (Array.isArray(obj[v])) {
        if (obj[v].length && obj[v].indexOf('All') === -1) {
          a[v] = obj[v]
        }
      } else {
        if (obj[v]) {
          a[v] = obj[v]
        }
      }
    })
    return a
  }

  // 根据账单ID获取账单详情
  const getBillInfoById = (id: any) => {
    axios.get(GET_BILL_DETAIL, { params: { invoiceId: id } }).then(res => {
      console.log(res)
    })
    console.log(id)
  }

  useEffect(() => {
    console.log(waitPayMoney)
  }, [waitPayMoney])

  useEffect(() => {
    console.log('step', step, isBatch)
    if (step === 2 - isBatch && payId) {
      getBatchToPay([payId])
    }
  }, [step])

  const handleChooseBill = (billList: any) => {
    setCheckedList(billList)
    setStep(2)
  }

  const handleChoosePayWay = (obj?: any) => {
    const temp = [...steps]
    if (obj) {
      setPayWay(obj.paymentType)
      setAccountInfo(obj)
      if (!obj.id || obj.paymentType === 'BANK' || obj.paymentType === 'VIRTUALCOIN') {
        setSteps(temp.slice(0, step).concat([{ title: '确定付款账号' }, { title: '确定收款账号' }]))
        if (!obj.id) {
          setAddNewPayWay(true)
        } else {
          setAddNewPayWay(false)
        }
      } else {
        const temp = [...steps]
        setSteps(temp.slice(0, step).concat([{ title: '确定付款' }]))
        setAddNewPayWay(false)
      }
    } else {
      setPayWay('')
      setAccountInfo({})
      setSteps(temp.slice(0, step).concat([{ title: '确定付款' }]))
      setAddNewPayWay(false)
    }
  }
  const handleNextStep = async (money: number | string) => {
    console.log('handleNextStep')
    if (!addNewPayWay && payWay !== 'BANK' && payWay !== 'VIRTUALCOIN') {
      setWaitPayMoney(Number(money))
      setShowDialog(true)
    } else {
      if (!addNewPayWay) {
        const params = {
          invoiceIds: checkedList.reduce((fin: any, v: any) => {
            if (v.billList) {
              fin.push(...v.billList.map((item: any) => item.invoiceId))
            } else {
              fin.push(v.invoiceId)
            }
            return fin
          }, []),
          paymentId: accountInfo.id
        }
        console.log(params)
        axios.post(GET_FINAL_MONEY_BY_CURRENCY_AND_TOTAL, params).then(res => {
          setFinalBill(res.data.data)
          setStep(step + 1)
        })
      } else {
        setStep(step + 1)
      }
    }
  }

  //TODO

  const dispatch = useDispatch<AppDispatch>()

  const handleBack = () => {
    if (step === 1 || step === 4 - isBatch) {
      router.replace('/payment/Payment')
    } else {
      setStep(step - 1)
    }
  }

  const handleSaveAccount = async (account: any) => {
    const params = {
      ...account,
      businessEntityId: billInfo.businessEntityId
    }
    await axios.post(ADD_PAY_WAY, params).then(async res => {
      setAccountInfo({
        ...params,
        id: res.data.data
      })
      setTimeout(async () => {
        await getFinalCurrencyAndMoney(res.data.data)
        setAddNewPayWay(false)
      }, 100)
    })
  }

  const goBackToList = () => {
    router.replace('/payment/Payment')
  }

  // 获取 预支付金额及币种
  const getFinalCurrencyAndMoney = (id?: string) => {
    const params = {
      invoiceIds: checkedList.reduce((fin: any, v: any) => {
        if (v.billList) {
          fin.push(...v.billList.map((item: any) => item.invoiceId))
        } else {
          fin.push(v.invoiceId)
        }
        return fin
      }, []),
      paymentId: id || accountInfo.id
    }
    console.log(params)
    axios.post(GET_FINAL_MONEY_BY_CURRENCY_AND_TOTAL, params).then(res => {
      setFinalBill(res.data.data)
    })
  }

  const getFinalBillInfo = () => {
    axios.post(CREATE_FINAL_INVOICE, { prepareId: finalBill?.prepareId }).then(res => {
      if (res.data.code === 'SUCCESS') {
        setFinalInvoice(res.data.data)
      }
    })
  }

  const handleDialogSure = async () => {
    if (step === 4 - isBatch) {
      goBackToList()
    } else if (3 - isBatch - (addNewPayWay || payWay === 'BANK' || payWay === 'VIRTUALCOIN' ? 0 : 1)) {
      await getFinalBillInfo()
      setShowDialog(false)
      setTimeout(() => {
        setStep(step + 1)
      }, 100)
    }
  }

  const handleCheckHasPay = () => {
    if (payWay === 'BANK') {
      axios.post(CHANGE_INVOICE_STATUS_TO_PENDING, { receiptId: finalInvoice.id }).then(res => {
        if (res.data.code === 'SUCCESS') {
          setShowDialog(true)
        }
      })
    } else {
      goBackToList()
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const toDashboard = () => {
    router.replace('/dashboards')
  }

  const dialogInside = () => {
    const compareStep = 3 - isBatch - (addNewPayWay || payWay === 'BANK' ? 0 : 1)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8.5 }}>
        <Box component='img' src='/images/bill/create-bill.png' width={96}></Box>
        <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 2, mt: 8 }}>
          {step === compareStep ? '继续付款' : '等待您的线下转账'}
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#606266', mb: 5 }}>
          {step === compareStep
            ? '继续下一步将生成收据，生成收据后，您将无法对付款方式进行更改'
            : '我们收到您的线下转账之后，会将该收据状态标注为“已支付”'}
        </Typography>
        <Box>
          {step === compareStep && (
            <Button
              size='large'
              type='submit'
              variant='outlined'
              onClick={() => {
                setShowDialog(false)
              }}
              sx={{ mr: 4 }}
            >
              {t('取消')}
            </Button>
          )}
          <Button
            size='large'
            type='submit'
            variant='contained'
            onClick={() => {
              handleDialogSure()
            }}
            style={{}}
          >
            {t('确定')}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Grid container justifyContent='center'>
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: '#564A96', height: 48, position: 'absolute', left: 0, top: 0, width: '100%' }}
      >
        <Box
          component='img'
          src='/images/bill/paying-logo.png'
          height='100%'
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            toDashboard()
          }}
        />
      </Grid>
      <Grid item md={8} sm={12} sx={{ mt: 16 }}>
        <Stack>
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <Box onClick={handleBack}>
                <Fab
                  aria-label='back'
                  sx={{ backgroundColor: common.white, width: '28px', height: '28px', minHeight: '28px' }}
                >
                  <Icon icon='material-symbols:arrow-back' />
                </Fab>
              </Box>

              <TypographyStyled
                variant='body2'
                sx={{
                  mt: 2,
                  ml: 2,
                  fontSize: '14px',
                  color: theme.palette.secondary.light,
                  [theme.breakpoints.down(380)]: { display: 'none' }
                }}
              >
                {t('Register.Back')}
              </TypographyStyled>
              <Typography textAlign='left' style={{ paddingLeft: '20px', fontSize: '16px' }}>
                付款给团队
              </Typography>
            </Box>
          </Box>
        </Stack>
        {isBatch === 0 && step === 1 && (
          <Grid
            container
            style={{ backgroundColor: '#fff', marginBottom: '20px', padding: '10px 20px', borderRadius: '8px' }}
          >
            <Grid item xs={12} sm={2.5} style={{ marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('Entity')}</InputLabel>
                <Select
                  size='small'
                  label={t('Entity')}
                  value={params.entityId}
                  onChange={e => setParams((pre: any) => ({ ...pre, entityId: e.target.value }))}
                >
                  {allDic.entities.map(v => (
                    <MenuItem key={v.entiryId} value={v.entiryId}>
                      {t(v.entiryName)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5} style={{ marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('合同类型')}</InputLabel>
                <Select
                  size='small'
                  label={t('合同类型')}
                  value={params.contractType}
                  onChange={e => setParams((pre: any) => ({ ...pre, contractType: e.target.value }))}
                >
                  {allDic.contractTypeList.map(v => (
                    <MenuItem key={v.value} value={v.value}>
                      {t(v.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5} style={{ marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('Currency')}</InputLabel>
                <Select
                  size='small'
                  label={t('Currency')}
                  value={params.currency}
                  onChange={e => setParams((pre: any) => ({ ...pre, currency: e.target.value }))}
                >
                  {allDic.currencies.map(v => (
                    <MenuItem value={v.currencyId}>{t(v.currencyName)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5} style={{ marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('国家')}</InputLabel>
                <Select
                  size='small'
                  label={t('国家')}
                  value={params.countryCode}
                  onChange={e => setParams((pre: any) => ({ ...pre, countryCode: e.target.value }))}
                >
                  {allDic.countries.map(v => (
                    <MenuItem value={v.areaCode}>{t(v.name)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        <Grid container item md={12} sm={12}>
          <Hidden smDown>
            <Grid item xs={3} sm={0} sx={{ backgroundColor: '#fff', pl: 4, borderRadius: '8px' }}>
              <VerticalSteper step={step - 1} steps={steps} />
            </Grid>
            <Grid item xs={0.4}></Grid>
          </Hidden>
          <Grid container md={8.6} sm={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {step === 1 - isBatch && (
              <TeamStep1
                billMap={billMap}
                onCancel={handleBack}
                onSure={handleChooseBill}
                exchangeRateMap={exchangeRates}
                billInfo={billInfo}
              />
            )}
            {step === 2 - isBatch && (
              <ChoosePayWay
                currentWay={payWay}
                waitPayList={checkedList}
                hasSavePayWayList={hasSavePayWayList}
                waitSavePayWayList={waitSavePayWayList}
                handleChoosePayWay={handleChoosePayWay}
                onCancel={handleBack}
                onSure={handleNextStep}
                waitPayMoney={waitPayMoney}
                billInfo={billInfo}
                accountInfo={accountInfo}
              />
            )}
            {step === 3 - isBatch && (payWay === 'WECHAT' || payWay === 'ALIPAY') && !addNewPayWay && (
              <QrCodePay
                waitPayMoney={waitPayMoney}
                onCancel={goBackToList}
                onSure={() => {}}
                payInfo={payInfo}
                payWay={payWay}
              />
            )}
            {step === 3 - isBatch && (addNewPayWay || payWay === 'BANK' || payWay === 'VIRTUALCOIN') && (
              <BankTransfer
                waitPayMoney={waitPayMoney}
                onCancel={() => {
                  setStep(step - 1)
                }}
                onSure={() => {
                  setShowDialog(true)
                }}
                payAccount={accountInfo}
                addNewPayWay={addNewPayWay}
                currentPayWay={payWay}
                finalBillInfo={finalBill}
                onSaveAccount={handleSaveAccount}
                entityCountry={billInfo.entityCountry}
              />
            )}
            {step === 4 - isBatch && (
              <QrCodePay
                waitPayMoney={waitPayMoney}
                onCancel={goBackToList}
                onSure={() => {
                  handleCheckHasPay()
                }}
                payInfo={payInfo}
                payWay={payWay}
                finalInvoice={finalInvoice}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
          handleCloseDialog()
        }}
        fullWidth
        sx={{
          '.MuiPaper-root': {
            maxWidth: 'fit-content',
            width: { xs: '100%', md: 480 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        {dialogInside()}
      </Dialog>
    </Grid>
  )
}

/*ContractCreateFullTime.setConfig = () => {
  return {
    appBar: 'hidden'
  }
}*/

export default ContractCreateFullTime
