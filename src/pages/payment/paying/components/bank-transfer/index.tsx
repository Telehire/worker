import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {BillPropsType} from "@/types/biz/bill";

// ** React Imports
import { useEffect, useState } from 'react'
import Icon from "@/@core/components/icon";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {matchIsValidTel} from "mui-tel-input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import {GET_COUNTRY_LIST, GET_CURRENCY_LIST, GET_BANK_LIST_BY_COUNTRY} from 'src/apis';
import { PayAccountType } from 'src/types/biz/bill'
import Box from "@mui/material/Box";
import axios from "axios";

interface IProps {
  waitPayMoney: number;
  onCancel: any,
  onSure: any,
  payAccount: any;
  addNewPayWay: boolean;
  currentPayWay: string;
  onSaveAccount: any,
  entityCountry: string,
  finalBillInfo?: any
}

interface FormInputs{
  corporateAccountsName: string;
  openingBank: string;
  corporateAccounts: string;
  corporateAccountsRepeat: string;
  openingProvince: string;
  openingCity: string;
  openingBankAddress: '',
  countryCode: string,
  currency: string,
  virtualCurrency: string
}

const currencyMap: {[key: string]: any} = {
  'CNY': {
    name: '人民币',
    icon: '¥',
  },
  'USD': {
    name: '美元',
    icon: '$'
  }
}

const VIRTUALCOIN_MAP: {[key: string]: any} = [
  {
    currencyId: 'USDT',
    currencyName: 'USDT',
  },
  {
    currencyId: 'USDC',
    currencyName: 'USDC',
  }
]

const virtualAccount = [
  {
    name: 'ERC20',
    accountNo: '0xba9ccb260399458fDc95F063C1412b27cF02643c'
  },
  {
    name: 'TRC20',
    accountNo: 'TFPphnjwVK1syJxvBU4Je6ECahJ8gpwv6C'
  },
  {
    name: 'POLYGON',
    accountNo: '0xba9ccb260399458fDc95F063C1412b27cF02643c'
  },
  {
    name: 'BSC',
    accountNo: '0xba9ccb260399458fDc95F063C1412b27cF02643c'
  },
]

const schema = yup.object().shape({
  corporateAccountsName: yup.string().required('企业对公账户户名'),
  openingBank: yup.string().required('请选择开户银行'),
  corporateAccounts: yup.string().required('请输入对公账户'),
  corporateAccountsRepeat: yup.string().required('再次输入对公账号').test('两次输入的对公账户必须相同', function () {
    return this.parent.corporateAccounts === this.parent.corporateAccountsRepeat
  }),
  openingBankAddress: yup.string().required('请输入开户行地址1'),
  countryCode: yup.string().required('开户银行所在国家/地区'),
  currency: yup.string().required('请选择汇出币种'),

  // openingProvince: yup.string().required('开户地-省份'),
  // openingCity: yup.string().required('开户地-城市'),
})

const BankTransfer = (props: IProps) => {
  const {waitPayMoney, onCancel,onSure, payAccount, addNewPayWay, currentPayWay, onSaveAccount, entityCountry, finalBillInfo } = props;
  const [countries, setCountries] = useState<any>([])
  const [currencyList, setCurrencyList] = useState<any>([])
  const [bankList, setBankList] = useState<any>([])
  const [provinceList, setProvinceList] = useState<any>([])
  const [cityList, setCityList] = useState<any>([])
  const [currentAccount, setCurrentAccount] = useState<any>()
  const [currentAccountNo, setCurrentAccountNo] = useState<any>()
  const defaultValues: {[key: string]: any} = {
    corporateAccountsName: '',
    openingBank: '',
    corporateAccounts: '',
    corporateAccountsRepeat: '',
    openingProvince: '',
    openingCity: '',
    openingBankAddress: '',
    countryCode: '',
    currency: ''
  }
  const defaultVBValues: {[key: string]: any} = {
    address: '',
    countryCode: '',
    currency: ''
  }

  useEffect(() => {
    console.log('finalBillInfo', finalBillInfo)
  }, [finalBillInfo])

  const {
    control,
    trigger,
    watch,
    register,
    unregister,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  useEffect(() => {
    getCountry()
    getCurrencyList()
  }, [])

  useEffect(() => {
    if(entityCountry === 'CN') {
      setValue('countryCode', 'CN')
      setValue('currency', 'CNY')
      getBankList('CN')
      getProvinceList('CN')
    }
  }, [entityCountry])


  useEffect(() => {

  })

  const getCountry = () => {
    axios.get(GET_COUNTRY_LIST, {params: {parent:0}})
      .then(res => {
        setCountries(res.data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const getCurrencyList = () => {
    axios.get(GET_CURRENCY_LIST)
      .then(res => {
        setCurrencyList(res.data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const getBankList = (country: string) => {
    axios.get(GET_BANK_LIST_BY_COUNTRY, {params: {country}})
      .then(res => {
        setBankList(res.data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }
  const getProvinceList = (parent: any) => {
    console.log('获取省份')
    axios.get(GET_COUNTRY_LIST, {params: {parent}})
      .then(res => {
        setProvinceList(res.data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const getCityList = (parent: any) => {
    console.log('获取城市')
    axios.get(GET_COUNTRY_LIST, {params: {parent}})
      .then(res => {
        setCityList(res.data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const handleNextStep = async () => {
    if(!addNewPayWay) {
      onSure()
    } else {
      if (currentPayWay === 'BANK') {
        const valid = await trigger(Object.keys(defaultValues) as any);
        if(valid) {
          handleSaveAccount()
        }
      } else if (currentPayWay === 'VIRTUALCOIN') {
        const valid = await trigger(Object.keys(defaultVBValues) as any);
        debugger;
        if(valid) {
          handleSaveVCAccount()
        }
      } else {
        const params: any = {};
        params.accountName = ''
        params.bankName = ''
        params.paymentType = currentPayWay
        params.accountNo = ''
        params.state_code = ''
        params.state_name = ''
        params.city_code = ''
        params.city_name = ''
        params.swiftNo = ''
        params.countryCode = 'CN'
        params.currency = 'CNY'
        params.bankAddress = ''
        onSaveAccount(params)
      }
    }
  }

  const handleSaveAccount = () => {
    const params: any = {};
    params.accountName = getValues('corporateAccountsName')
    params.bankName = getValues('openingBank')
    params.paymentType = payAccount.paymentType
    params.accountNo = getValues('corporateAccounts')
    params.state_code = getValues('openingProvince')
    params.state_name = provinceList.find((v: any) => getValues('openingProvince') === v.areaCode)?.name
    params.city_code = getValues('openingCity')
    params.city_name = cityList.find((v: any) => getValues('openingCity') === v.areaCode)?.name
    params.swiftNo = '7899954447788'
    params.countryCode = getValues('countryCode')
    params.currency = getValues('currency')
    params.bankAddress = params.state_name + params.city_name + getValues('openingBankAddress')
    onSaveAccount(params)
  }

  const handleSaveVCAccount = () => {
    const params: any = {};
    params.currency = getValues('virtualCurrency')
    params.accountName = currentAccount
    params.accountNo = currentAccountNo
    params.paymentType = payAccount.paymentType

    // params.bankAddress = params.state_name + params.city_name + getValues('openingBankAddress')
    onSaveAccount(params)
  }

  const handleChoosePayWay = (v: {name:string, accountNo:string}) => {
    setCurrentAccount(v.name);
    setCurrentAccountNo(v.accountNo);
  }

  return (
    <Grid md={12}>
      {
        !addNewPayWay || currentPayWay === 'VIRTUALCOIN' && (
          <Grid item xs={12} sx={{backgroundColor: '#fff', borderRadius: '8px', padding: '24px', mb: 6}}>
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
            <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>待支付总额</Typography>
            <Grid sx={{textAlign: 'right'}}>
              <Typography sx={{fontSize: 24, fontWeight: 500, color: '#3A3541'}}>{`${currencyMap[finalBillInfo?.currency]?.icon} ${(Number(finalBillInfo?.totalValue) / 1000).toFixed(2)}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        )
      }
      {
        currentPayWay === 'BANK' &&  <Grid item xs={12} sx={{backgroundColor: '#fff', borderRadius: '8px', padding: '24px', mb: 5}}>
          {
            !addNewPayWay && (
              <Grid item xs={12}>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :6}}>银行转账</Typography>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199', width: '100px', mr: 14}}>开户银行所在国家/地区</Typography>
                  <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{countries.find((v: any) => v.areaCode === payAccount.countryCode)?.name}</Typography>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>汇出币种</Typography>
                  <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{currencyMap[payAccount.currency]?.name}</Typography>
                </Grid>
              </Grid>
            )
          }
          {
            addNewPayWay && (
              <Grid item xs={12} sm={12}>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :0.5}}>银行转账</Typography>
                <Typography sx={{fontSize: 12, fontWeight: 400, flex: 1, color: '#3A3541DE', mb :6}}>你的帐户位于哪个国家或地区？</Typography>
                <Grid item xs={12} mb={6}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.countryCode)} htmlFor='countryCode'>
                      开户银行所在国家/地区
                    </InputLabel>
                    <Controller
                      name="countryCode"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label="开户银行所在国家/地区"
                          value={value}
                          disabled={entityCountry === 'CN'}
                          onChange={(e) => {
                            onChange(e.target.value);
                            getProvinceList(e.target.value);
                            getBankList(e.target.value)
                            setValue('openingProvince', '')
                            setValue('openingCity', '')
                            setValue('openingBank', '')
                          }}
                          error={Boolean(errors.countryCode)}
                          aria-describedby="countryCode"
                        >
                          {
                            countries.map((v: any) => (
                              <MenuItem value={v.areaCode}>{v.name}</MenuItem>
                            ))
                          }
                        </Select>)}
                    />
                    {errors.countryCode && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.countryCode.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} mb={6}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.currency)} htmlFor='countryCode'>
                      汇出币种
                    </InputLabel>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label="汇出币种"
                          value={value}
                          disabled={entityCountry === 'CN'}
                          onChange={(e) => {
                            onChange(e.target.value);
                          }}
                          error={Boolean(errors.currency)}
                          aria-describedby="currency"
                        >
                          {
                            currencyList.map((v: any) => (
                              <MenuItem value={v.currencyId}>{v.currencyName}</MenuItem>
                            ))
                          }
                        </Select>)}
                    />
                    {errors.currency && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.currency.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      }

      <Grid item xs={12} sx={{backgroundColor: '#fff', borderRadius: '8px', padding: '24px', mb: 5}}>
        {
          !addNewPayWay && (
            <Grid item xs={12}>
              <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :6}}>请确定您企业的对公账号</Typography>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199', width: '100px', mr: 14}}>对公账户户名</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{payAccount.accountName}</Typography>
              </Grid>
              {currentPayWay === 'BANK' && <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>开户银行</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{payAccount.bankName}</Typography>
              </Grid>}
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>对公账号</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{payAccount.accountNo}</Typography>
              </Grid>
              {currentPayWay === 'BANK' && <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>开户地点</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>{payAccount.bankAddress}</Typography>
              </Grid>}
            </Grid>
          )
        }
        {
          (addNewPayWay && currentPayWay === 'BANK') && (<Grid item xs={12}>
            <Typography sx={{fontSize: 16, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :6}}>输入您企业的对公账号</Typography>
            {/*企业对公账户户名*/}
            <Grid item xs={12} mb={6}>
              <FormControl fullWidth>
                <Controller
                  name="corporateAccountsName"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label="企业对公账户户名"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.corporateAccountsName)}
                      aria-describedby="corporateAccountsName"
                    />)}
                />
                {errors.corporateAccountsName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.corporateAccountsName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/*请选择开户银行*/}
            <Grid item xs={12} mb={6}>
              <InputLabel error={Boolean(errors.openingBank)} htmlFor='openingBank'>
                请选择开户银行
              </InputLabel>
              <FormControl fullWidth>
                <Controller
                  name="openingBank"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="请选择开户银行"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.openingBank)}
                      aria-describedby="openingBank"
                    >
                      {
                        bankList.map((v: any) => (
                          <MenuItem value={v.name}>{v.name}</MenuItem>
                        ))
                      }
                    </Select>)}
                />
                {errors.openingBank && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.openingBank.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/*请输入对公账户*/}
            <Grid item xs={12} mb={6}>
              <FormControl fullWidth>
                <Controller
                  name="corporateAccounts"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label="请输入对公账户"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.corporateAccounts)}
                      aria-describedby="corporateAccounts"
                    />)}
                />
                {errors.corporateAccounts && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.corporateAccounts.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/*再次输入对公账号*/}
            <Grid item xs={12} mb={6}>
              <FormControl fullWidth>
                <Controller
                  name="corporateAccountsRepeat"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label="再次输入对公账号"
                      value={value}
                      onChange={async (e) => {
                        onChange(e.target.value);
                        await trigger('corporateAccountsRepeat')
                      }}
                      error={Boolean(errors.corporateAccountsRepeat)}
                      aria-describedby="corporateAccountsRepeat"
                    />)}
                />
                {errors.corporateAccountsRepeat && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.corporateAccountsRepeat.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} mb={6} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {/*开户地-省份*/}
              <Grid item xs={5.5}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.openingProvince)} htmlFor='openingProvince'>
                    开户地-省份
                  </InputLabel>
                  <Controller
                    name="openingProvince"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label="开户地-省份"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                          getCityList(e.target.value);
                          setValue('openingCity', '')
                        }}
                        error={Boolean(errors.openingProvince)}
                        aria-describedby="openingProvince"
                      >
                        {
                          provinceList.map((v: any) => (
                            <MenuItem value={v.areaCode}>{v.name}</MenuItem>
                          ))
                        }
                      </Select>)}
                  />
                  {errors.openingProvince && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.openingProvince.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/*开户地-城市*/}
              <Grid item xs={5.5}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.openingCity)} htmlFor='openingCity'>
                    开户地-城市
                  </InputLabel>
                  <Controller
                    name="openingCity"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label="开户地-城市"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.openingCity)}
                        aria-describedby="openingCity"
                      >
                        {
                          cityList.map((v: any) => (
                            <MenuItem value={v.areaCode}>{v.name}</MenuItem>
                          ))
                        }
                      </Select>)}
                  />
                  {errors.openingCity && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.openingCity.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/*开户行详细地址*/}
            <Grid item xs={12} mb={6}>
              <FormControl fullWidth>
                <Controller
                  name="openingBankAddress"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label="请输入开户行详细地址"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.openingBankAddress)}
                      aria-describedby="openingBankAddress"
                    />)}
                />
                {errors.openingBankAddress && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.openingBankAddress.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>)
        }
        {/*添加支付方式-支付宝*/}
        {
          (addNewPayWay && currentPayWay === 'ALIPAY') && (
            <Grid item mb={6}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>支付方式</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', display: 'flex', alignItems: 'center'}}>
                  <Box component='img' src='/images/bill/alipay-logo.png' sx={{ mr: 6, width: '40px',height: '40px', display: 'flex', alignItems: 'center' }} />
                  支付宝</Typography>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>转账币种</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>人民币</Typography>
              </Grid>
            </Grid>
          )
        }
        {/*添加支付方式-微信*/}
        {
          (addNewPayWay && currentPayWay === 'WECHAT') && (
            <Grid item mb={6}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>支付方式</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', display: 'flex', alignItems: 'center'}}>
                  <Box component='img' src='/images/bill/wechart-logo.png' sx={{ mr: 6, width: '40px',height: '40px', display: 'flex', alignItems: 'center' }} />
                  微信
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>转账币种</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>人民币</Typography>
              </Grid>
            </Grid>
          )
        }
        {/*添加支付方式-虚拟货币*/}
        {
          (addNewPayWay && currentPayWay === 'VIRTUALCOIN') && (
            <Grid item mb={6}>
              <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :6}}>添加支付方式</Typography>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A354199',width: '100px', mr: 14}}>支付方式</Typography>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', display: 'flex', alignItems: 'center'}}>
                  <Box component='img' src='/images/bill/bitcoin-logo.png' sx={{ mr: 6, width: '40px',height: '40px', display: 'flex', alignItems: 'center' }} />
                  虚拟货币
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', mb: 3, padding: '9px 16px'}}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.currency)} htmlFor='countryCode'>
                    汇出币种
                  </InputLabel>
                  <Controller
                    name="virtualCurrency"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label="汇出币种"
                        value={value}
                        onChange={(e) => {
                          console.log(e)
                          onChange(e.target.value);
                        }}
                        error={Boolean(errors.currency)}
                        aria-describedby="currency"
                      >
                        {
                          VIRTUALCOIN_MAP.map((v: any) => (
                            <MenuItem value={v.currencyId}>{v.currencyName}</MenuItem>
                          ))
                        }
                      </Select>)}
                  />
                  {errors.currency && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.currency.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE', mb :6}}>转账地址</Typography>
                {
                  virtualAccount.map(v => (
                    <Grid
                      item
                      xs={12}
                      sx={{backgroundColor: '#F9FAFC', borderRadius: '8px',padding: '12px 16px', mb: 4,display: 'flex', border: (v.name === currentAccount) ? '1px solid #7C4DFF' : '1px solid #F9FAFC'}}
                      onClick={() => {handleChoosePayWay(v)}}
                    >
                      {/* <Box component='img' src={logoMap[v.paymentType]} sx={{ mr: 3, width: '40px',height: '40px', display: 'flex', alignItems: 'center' }} /> */}
                      <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Grid sx={{ flex: 1}}>
                          <Typography sx={{fontSize: 14, fontWeight: 500, color: '#303133'}}>{v.name}</Typography>
                          <Typography sx={{fontSize: 12, fontWeight: 488, color: '#909399'}}>{v.accountNo}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          )
        }
        <Grid container xs={12} sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <Button variant="text" onClick={() => {onCancel()}} sx={{border: '1px solid #8A8D9380', borderRadius: '5px',color: '#8A8D93', width: 73, height: 38,mr: 2}}>取消</Button>
          <Button variant="contained" onClick={() => {handleNextStep()}} sx={{width: 73, height: 38}}>继续</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default BankTransfer
