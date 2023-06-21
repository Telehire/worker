// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import {cusFormatDate} from 'src/@core/utils/format'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { common } from '@mui/material/colors'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { DataGrid } from '@mui/x-data-grid'
import Stack from '@mui/material/Stack'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import Icon from '../../../@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import axios from "axios";
import { GET_BILL_LIST, GET_INVOICE_LIST, GET_BILL_STATUS_LIST, GET_WAIT_PAY_BILL_AMOUNT } from "@/apis/payment";
import Pagination from "@mui/material/Pagination";
import {GET_CURRENCY_LIST} from "@/apis";

enum TabsType {
  ToBePaid = 1,
  Paid = 2
}
interface Bill {
  id:  string;
  invoiceId: string
  invoiceCode: string;
  invoiceName: string;
  invoiceDate: string,
  invoiceCurrency: string;
  invoiceTotalValue: string;
  gmtCreate: string | number;
  status: string;
  jobTitle: string;
  employee: {
    name: string
    title: string
  }
  team: {
    name: string
  }
  contractStatus: string
  contractType: string
  salary: number
  salaryPeriod: string
  location: string
  receiptName: string
  receiptCurrency: string
  paymentType: string
  receiptCode: string
  invoiceValue: string
  srcPaymentId: string
  paymentOrderId?: string
  staffName?: string
  teamName?: string
}

interface IParams {
  status?: string
  contractType?: string
  more?: string
  createDate?: any
  invoiceDate?: any
  currency?: any
  type?: any
}

const currencyMap: {[key: string]: string} = {
  'CNY': '人民币',
  'USD': '美元'
}

const payWayMap: {[key: string]: string} = {
  'BANK': '银行转账',
  'ALIPAY': '支付宝',
  'WECHAT':  '微信',
}

const invoiceStatusList: {value: string, name: string}[] = [
  {
    value: 'UNPAID',
    name: '未支付',
  },
  {
    value: 'PENDING',
    name: '等待资金到账',
  },
  {
    value: 'PAID',
    name: '已支付',
  }
]

const pageSizeList = [10, 20, 50, 100];


const PaymentList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [tabKey, setTabkey] = useState<TabsType>(TabsType.ToBePaid)
  const [params, setParams] = useState<IParams>({ status: '', contractType: '', more: '', invoiceDate: '', currency: '',type: '', createDate: '' })
  const [billRows, setBillRows] = useState<Bill[]>([]);
  const [invoiceRows, setInvoiceRows] = useState<Bill[]>([]);
  const [billStatusList, setBillStatusList] = useState<any[]>([]);
  const [totalCount,setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [count, setCount] = useState<any>({bill: 0, invoice: 0})
  const [waitPayBillAmount, setWaitPayBillAmount] = useState<number>(0)
  const [allDic, setAllDic] = useState<{currencies: any[]}>({currencies: []})
  const router = useRouter()
  const columns = [
    {
      field: 'invoiceId',
      headerName: '账单',
      columnType: TabsType.ToBePaid,
      minWidth: 350,
      renderCell: ({ row }: { row: Bill }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.invoiceName}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
              {row.invoiceCode}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      align: 'right',
      field: 'contractStatus',
      headerName: '账单状态',
      minWidth: 150,
      type: 'number',
      columnType: TabsType.ToBePaid,
      renderCell: ({ row }: { row: Bill }) => {
        const lastTime = new Date().getTime() - new Date(row.invoiceDate).getTime()
        if(lastTime < 0) {
          return  <CustomChip rounded label={row.status} skin='light' color='info' />
        } else {
          const delayDay = Math.floor(lastTime / (1000*60*60*24))
          return  <CustomChip rounded label={`逾期${delayDay}天`} skin='light' color='error' />
        }

      }
    },
    {
      field: 'invoiceId',
      headerName: '收据',
      columnType: TabsType.Paid,
      minWidth: 350,
      renderCell: ({ row }: { row: Bill }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.receiptName}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
              {row.receiptCode}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'paid',
      minWidth: 200,
      columnType: TabsType.Paid,
      headerName: '支付方式',
      renderCell: ({ row }: { row: Bill }) => (
        <Typography sx={{ fontSize: 14, color: '#606266' }}>{payWayMap[row.paymentType]}</Typography>
      )
    },
    {
      field: 'currency',
      minWidth: 200,
      columnType: TabsType.Paid,
      headerName: '币种',
      renderCell: ({ row }: { row: Bill }) => (
        <Typography sx={{ fontSize: 14, color: '#606266' }}>{currencyMap[row.receiptCurrency]}</Typography>
      )
    },
    {
      field: 'contractType',
      minWidth: 300,
      columnType: TabsType.ToBePaid,
      headerName: '合同',
      flex: 1,
      renderCell: ({ row }: { row: Bill }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={`/images/avatars/${row.invoiceId}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.staffName}-{row.jobTitle}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
              {row.teamName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'currency',
      minWidth: 200,
      columnType: TabsType.ToBePaid,
      headerName: '账单币种',
      renderCell: ({ row }: { row: Bill }) => (
        <Typography sx={{ fontSize: 14, color: '#606266' }}>{currencyMap[row.invoiceCurrency]}</Typography>
      )
    },
    {
      align: 'right',
      field: 'salary',
      columnType: TabsType.ToBePaid,
      headerName: '金额',
      minWidth: 200,
      type: 'number',
      renderCell: ({ row }: { row: Bill }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{`${row.invoiceCurrency} ${(Number(row.invoiceTotalValue) / 1000).toFixed(2)}`}</Typography>
          {/*<Typography sx={{ fontSize: 12, color: '#909399' }}>{}</Typography>*/}
        </Stack>
      )
    },
    {
      align: 'right',
      field: 'salary',
      columnType: TabsType.Paid,
      headerName: '金额',
      minWidth: 200,
      type: 'number',
      renderCell: ({ row }: { row: Bill }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{`${row.receiptCurrency} ${(Number(row.invoiceValue) / 1000).toFixed(2)}`}</Typography>
          {/*<Typography sx={{ fontSize: 12, color: '#909399' }}>{}</Typography>*/}
        </Stack>
      )
    },
    {
      align: 'right',
      field: 'limitDay',
      headerName: '付款截止日期',
      columnType: TabsType.ToBePaid,
      minWidth: 200,
      type: 'number',
      renderCell: ({ row }: { row: Bill }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{row.invoiceDate}</Typography>
          {/*<Typography sx={{ fontSize: 12, color: '#909399' }}>{}</Typography>*/}
        </Stack>
      )
    },
    {
      align: 'right',
      field: 'createTime',
      columnType: TabsType.Paid,
      headerName: '生成时间',
      minWidth: 200,
      type: 'number',
      renderCell: ({ row }: { row: Bill }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{cusFormatDate(row.gmtCreate, 'second')}</Typography>
        </Stack>
      )
    },
    
    {
      align: 'right',
      field: 'contractStatus',
      headerName: '付款状态',
      minWidth: 200,
      type: 'number',
      columnType: TabsType.Paid,
      renderCell: ({ row }: { row: Bill }) => (
        <CustomChip rounded label={row.status} skin='light' color='info' />
      )
    },
    {
      field: 'opration',
      headerName: '操作',
      columnType: TabsType.Paid,
      renderCell: ({ row }: { row: Bill }) => {
        const options = [
          {
            text: '下载收据CSV',
            menuItemProps: {
              onClick: () => {window.open(`/api/pay/receipt/download-detail?receiptId=${row.id}`)}
            }
          },
          {
            text: '下载发票',
            menuItemProps: {
              onClick: () => {window.open(`/api/pay/receipt/download-detail?receiptId=${row.id}`)}
            }
          },
        ]
        if(row.status === 'UNPAID') {
          options.push({
            text: '继续支付',
            menuItemProps: {
              onClick: () => {
                router.push(`/payment/paying?invoiceId=${row.id}`)
              }
            }
          })
        }
       return <OptionsMenu
          options={options}
          iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }}
        />
      }
    },
    {
      field: 'opration',
      headerName: '操作',
      columnType: TabsType.ToBePaid,
      renderCell: ({ row }: { row: Bill }) => {
        if(row.paymentOrderId) {
          return <OptionsMenu options={[
            {
              text: 'Download CSV',
              menuItemProps: {
                onClick: () => {window.open(`/api/pay/invoice/download-detail?invoiceId=${row.invoiceId}`)}
              }
            }

          ]}  iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
        } else {
          return <OptionsMenu options={[
            {
              text: 'ToPay',
              menuItemProps: {
                onClick: () => {handleToPay('ToPay', row)}
              }
            },
            {
              text: 'Download CSV',
              menuItemProps: {
                onClick: () => {window.open(`/api/pay/invoice/download-detail?invoiceId=${row.invoiceId}`)}
              }
            }

          ]}  iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
        }
      }
    }
  ]
  const toBatchPay = () => {
    router.push('/payment/paying?batch=true')
  }

  useEffect(() => {
    setParams({})
  }, [tabKey])

  useEffect(() => {
    if(tabKey === TabsType.ToBePaid) {
      getBillList()
    } else {
      getInvoiceList()
    }
  }, [params])

  useEffect(() => {
    if(tabKey === TabsType.ToBePaid) {
      getBillList()
    } else {
      getInvoiceList()
    }
  }, [page, pageSize])

  // 获取账单及收据数量
  useEffect(() => {
    getInvoiceList(1)
    getBillStatusList()
    getWaitPayBillAmount()
    getAllDic()
  }, [])

  const getAllDic = () => {
    const getCurrencirs = axios.get(GET_CURRENCY_LIST)
    Promise.all([getCurrencirs]).then(res => {
      setAllDic({
        currencies: res[0].data.data
      })
    })
  }


  const getWaitPayBillAmount = () => {
    axios.get(GET_WAIT_PAY_BILL_AMOUNT, {}).then(res => {
      if (res.data.code === 'SUCCESS') {
        setWaitPayBillAmount(res.data.data)
      }
    })
  }

  const getBillStatusList = () => {
    axios.get(GET_BILL_STATUS_LIST).then(res => {
      console.log(res)
      if(res.data.code === 'SUCCESS') {
        setBillStatusList(res.data.data)
      }
    })
  }

  const getBillList = () => {
    const tempParams = deleteEmpty(params);
    if(tempParams.invoiceDate) {
      tempParams.invoiceDate = cusFormatDate(tempParams.invoiceDate, 'yyyy-mm-dd')
    }

    // tempParams.start = (page - 1) * pageSize
    // tempParams.rows = pageSize
    axios.post(GET_BILL_LIST, tempParams).then(res => {
      if(res.data.code === 'SUCCESS') {
        setBillRows(res.data.data.pageList || [])
        setTotalCount(res.data.data.totalCount)
        setCount({...count, bill: res.data.data.totalCount})
      }
    }).catch(() => {
    })
  }

  const getInvoiceList = (key?: number) => {
    const tempParams = deleteEmpty(params);
    if(tempParams.createDate) {
      tempParams.createDate = cusFormatDate(tempParams.createDate, 'yyyy-mm-dd')
    }

    // tempParams.start = (page - 1) * pageSize
    // tempParams.rows = pageSize
    axios.post(GET_INVOICE_LIST, tempParams).then(res => {
      if(res.data.code === 'SUCCESS') {
        // 防止因为tab切换过快导致数据错乱
        setInvoiceRows(res.data.data.pageList || [])
        setTotalCount(res.data.data.totalCount)
        setCount({...count, invoice: res.data.data.totalCount})
      }
    })
  }

  const deleteEmpty = (obj: any) => {
    const a:any = {};
    Object.keys(obj).forEach(v => {
      if(Array.isArray(obj[v])) {
        if(obj[v].length && obj[v].indexOf('All') === -1) {
          a[v] = obj[v]
        }
      } else {
        if(obj[v]) {
          a[v] = obj[v]
        }
      }
    })
    return a
  }

  const handleSearch = async (key:string, val: any) => {
    switch(key) {
      case 'page':
        setPage(val);
        break;
      case 'pageSize':
        setPageSize(val);
        setPage(1);
        break;
      default:
        setParams({
          ...params,
          [key]: val
        });
        break;
    }
  }

  const handleToPay = (type: string, row: Bill) => {
    switch (type) {
      case 'ToPay':
        router.push(`/payment/paying/?billId=${row.invoiceId}`);
        break;
      default:
        break
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Grid container md={12} sx={{ mb: 5 }} spacing={2} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Grid container md={5.9}  sx={{display: 'flex', justifyContent: 'space-between',height: 72, alignItems: 'center', backgroundColor: '#fff',pl: 4, pr: 4, borderRadius: 2}}>
          <Grid sx={{display: 'flex', justifyContent: 'space-between', height: 36, alignItems: 'center', fontSize: 14, fontWeight: 600, }}>
            <Box component='img' src='/images/payment/wait_check.png' sx={{ mr: 4, width: 36, display: 'flex', alignItems: 'center' }} />
            有5个待审批的项目
          </Grid>
          <Button size="small" variant='text' style={{border: '1px solid #9155FD', width: 53, height: 30}}>
            审批
          </Button>
        </Grid>
        <Grid container md={5.9}  sx={{display: 'flex', justifyContent: 'space-between',height: 72, alignItems: 'center',backgroundColor: '#fff', pl: 4, pr: 4, borderRadius: 2}}>
          <Grid sx={{display: 'flex', justifyContent: 'space-between', height: 36, alignItems: 'center', fontSize: 14, fontWeight: 600}}>
            <Box component='img' src='/images/payment/wait_pay.png' sx={{ mr: 4, width: 36, display: 'flex', alignItems: 'center' }} />
            {`有${waitPayBillAmount}个未付款的账单`}
          </Grid>
          <Button size="small" variant='contained' style={{border: '1px solid #9155FD', width: 53, height: 30}} disabled={!waitPayBillAmount} onClick={() => toBatchPay()}>
            付款
          </Button>
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={10}>
          <Tabs value={tabKey} onChange={(e, val) => setTabkey(val)}>
            <Tab value={TabsType.ToBePaid} label={`账单列表（${count.bill}）`} />
            <Tab value={TabsType.Paid} label={`收据列表（${count.invoice}）`} />
          </Tabs>
        </Grid>
      </Grid>

      <Grid container sx={{ background: theme.palette.background.paper }}>
        {
          tabKey === TabsType.ToBePaid && <Grid item xs={12} sx={{ py: 3.5, px: 6 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('账单状态')}</InputLabel>
                  <Select
                    size='small'
                    label={t('账单状态')}
                    value={params.status}
                    onChange={e => setParams(pre => ({ ...pre, status: e.target.value }))}
                  >
                    {
                      billStatusList.map(v => (
                        <MenuItem value={v.code}>{t(v.name)}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('合同类型')}</InputLabel>
                  <Select
                    size='small'
                    label={t('合同类型')}
                    value={params.contractType}
                    onChange={e => setParams(pre => ({ ...pre, contractType: e.target.value }))}
                    sx={{ textAlign: 'start', width: '100%' }}
                  >
                    <MenuItem value="EOR">{t('EOR 合同')}</MenuItem>
                    <MenuItem value="Contract">{t('承包商合同')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <DatePickerWrapper
                    className="custom-react-datepicker-wrapper"
                  >
                    <DatePicker
                      selected={params.invoiceDate}
                      id='basic-input'
                      popperPlacement={popperPlacement}
                      onChange={(date) => {
                        setParams({
                          ...params,
                          invoiceDate: date
                        })
                      }}
                      placeholderText='支付日期'
                      customInput={<CustomInput size="small" label='支付日期' />}
                    />
                  </DatePickerWrapper>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        }
        {
          tabKey === TabsType.Paid && <Grid item xs={12} sx={{ py: 3.5, px: 6 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('收据状态')}</InputLabel>
                  <Select
                    size='small'
                    label={t('收据状态')}
                    value={params.status}
                    onChange={e => setParams(pre => ({ ...pre, status: e.target.value }))}
                  >
                    {
                      invoiceStatusList.map((v: any) => (
                        <MenuItem value={v.value} key={v.value}>{t(v.name)}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('币种')}</InputLabel>
                  <Select
                    size='small'
                    label={t('币种')}
                    value={params.currency}
                    onChange={e => setParams(pre => ({ ...pre, currency: e.target.value }))}
                    sx={{ textAlign: 'start', width: '100%' }}
                  >
                    {
                      allDic.currencies.map((v: any) => (
                        <MenuItem value={v.currencyId}>{t(v.currencyName)}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('支付方式')}</InputLabel>
                  <Select
                    size='small'
                    label={t('支付方式')}
                    value={params.type}
                    onChange={e => setParams(pre => ({ ...pre, type: e.target.value }))}
                    sx={{ textAlign: 'start', width: '100%' }}
                  >
                    {
                      Object.keys(payWayMap).map((v: any) =>(
                        <MenuItem value={v} key={v}>{t(payWayMap[v])}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <DatePickerWrapper
                    className="custom-react-datepicker-wrapper"
                  >
                    <DatePicker
                      selected={params.createDate}
                      id='basic-input'
                      popperPlacement={popperPlacement}
                      onChange={(date) => {
                        setParams({
                          ...params,
                          createDate: date
                        })
                      }}
                      placeholderText='生成日期'
                      customInput={<CustomInput size="small" label='生成日期' />}
                    />
                  </DatePickerWrapper>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        }
        <Grid item xs={12}>
          <DataGrid
            autoHeight

            // @ts-ignore
            columns={columns.filter(val => !val.columnType || val.columnType === tabKey)}
            rows={(tabKey === TabsType.Paid ? invoiceRows : billRows).slice(0, 10)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            getRowId={(row: Bill) => row.gmtCreate}
            hideFooter
          />
        </Grid>
        <Grid container spacing={2} style={{alignItems: 'center', padding: '20px 0',display: 'flex'}}>
          <Pagination
            defaultPage={1}
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={(e, val) => {
              handleSearch('page' ,val)
            }}
          />
          <Select
            value={pageSize}
            size='small'
            onChange={(e) =>  handleSearch('pageSize', e.target.value)}
            sx={{ textAlign: 'start' }}
            style={{width: '100px', marginRight: '10px'}}
          >
            {
              pageSizeList.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))
            }
          </Select>
          <span>
            共{totalCount}条
          </span>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PaymentList
