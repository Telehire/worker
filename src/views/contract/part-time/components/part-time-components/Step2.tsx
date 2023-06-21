// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select  from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { styled, useTheme, lighten, darken } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchAllOrg, fetchAllTeam } from '@/store/apps/org'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { Switch } from '@mui/material'
import {
  saveEorContract,
  saveContractDetail,
  saveFixedCostContract,
  getFixedCostContractDetailById
} from '@/store/apps/contract'
import toast from 'react-hot-toast'
import {Alert} from "@mui/lab";
import Radio from '@mui/material/Radio'
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {DateType} from "@/types/forms/reactDatepickerTypes";
import axios from 'axios'
import { GET_CONFIG_WITH_LNG } from '@/apis'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
}

interface FormInputs {
  planEntryDate: DateType;
  paymentCycle: string;
  currency: string;
  fixedValue: string;
  customCycle: boolean;
  endTime: string;
  paymentDeadline: string;
  payBeforeWeekend: boolean;
  contractEndDate?: DateType
  contractFinishBufferDate: string;
}


const TypographyDescStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '0.875rem',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const TypographyTitleStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginTop: 15,
  fontSize: 16,
  fontWeight: 600,
  color: '3A3541DE',
  marginBottom: 15,
  textAlign: 'left',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))


const schema = yup.object().shape({
  paymentCycle: yup.string().required(),
  currency: yup.string().required(),
  fixedValue: yup.string().required(),
  customCycle: yup.boolean().required(),
  endTime: yup.string().test('请选择账单周期结束时间', function () {
    if (this.parent.customCycle) {
      return !!this.parent.endTime
    }else {
      return true
    }
  }),
  paymentDeadline: yup.string().test('请选择付款截止日期', function () {
    if (this.parent.customCycle) {
      return !!this.parent.paymentDeadline
    }else {
      return true
    }
  }),
  payBeforeWeekend: yup.boolean()
})

const schemaDialog = yup.object().shape({
  customJobScopeTitle: yup.string().required()
})

const temp1: {id: string, value: string}[] = [];
for(let i = 0; i < 31; i++) {
  temp1.push({
    id: String(i+1),
    value: `每月第${i+1}天`
  })
}
temp1.push({id: 'last', value: '每月最后一天'})

const weekMap: {[key: number]: string} = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
}

const temp2: {id: string, value: string}[] = [];
for(let i = 0; i < 7; i++) {
  temp2.push({
    id: String(i+1),
    value: `星期${weekMap[i+1]}`
  })
}

const temp3: {id: string, value: string}[] = [
  {
    id: '0',
    value: '同一天'
  },
  {
    id: '4',
    value: '5天后'
  },
  {
    id: '6',
    value: '7天后'
  },
  {
    id: '14',
    value: '15天后'
  },
  {
    id: '29',
    value: '30天后'
  },
];

let time = 0

const Step2 = ({ setStep, orgId, contractId }: Props) => {
  const {
    currentFixedCostContract
  } = useSelector((state: RootState) => state.contract)
  const { t } = useTranslation()

  // ** Hooks
  const theme = useTheme()
  const { direction } = theme
  const dispatch = useDispatch<AppDispatch>()
  const [times, setTimes] = useState<number>(0)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { organizations, teams } = useSelector((state: RootState) => state.org)
  const [radioChecked, setRadioChecked] = useState<string>('1')
  const [checkedCustomCycle, setCheckedCustomCycle] = useState<boolean>(false)
  const [paymentCycleList, setPaymentCycleList] = useState<{id: string, value: string}[]>([
    {
      id: 'monthly',
      value: '按月',
    },
    {
      id: 'weekly',
      value: '按周',
    },
  ])
  const [currencyList, setCurrencyList] = useState<{id: string, value: string}[]>([
    {
      id: 'USD',
      value: '美元'
    },
    {
      id: 'CNY',
      value: '人民币'
    }
  ])
  const getCurrency = async () => {
    const getCurrentDay = await axios.get(GET_CONFIG_WITH_LNG, {params: {
      rgroup: 'page.contract.eor.create.CN',
      rkey: 'salary.currency'
    }})
    console.log('getCurrentDay', getCurrentDay)
  }

  useEffect(() => {
    getCurrency()
  }, [])
  


  const [endTimeList, setEndTimeList] = useState<{id: string, value: string}[]>([...temp1])
  const [paymentDeadlineList, setPaymentDeadline] = useState<{id: string, value: string}[]>([...temp3])

  const defaultValues = {
    planEntryDate: new Date(),
    paymentCycle: '1',
    currency: '',
    customCycle: false,
    endTime: '',
    paymentDeadline: '',
    payBeforeWeekend: false,
    contractFinishBufferDate: '10'
  }

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'paymentCycle') {
        setTimes(time + 1)
        time+=1
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])



  const onSubmit = async () => {
    const params = {
      action: 'SALARY',
      contractId,
      orgId,
      teamId: currentFixedCostContract.teamId,
      type: 'temporary',
      salary: {
        planEntryDate: getValues('planEntryDate')?.getTime(),
        contractEndDate: getValues('contractEndDate'),
        contractFinishBufferDate: getValues('contractFinishBufferDate'),
        invoiceRuleInfo: {
          period: getValues('paymentCycle'),
          currency: getValues('currency'),
          fixedValue: getValues('fixedValue'),
          periodEndOffset: getValues('endTime'),
          gracePeriod: getValues('fixedValue'),
        }
      },
    }

    // setStep(prev => prev + 1)
    console.log(params)
    const {
      payload: { code }
    } = await dispatch(
      saveFixedCostContract(params)
    )
    if (code === 'SUCCESS') {
      await dispatch(getFixedCostContractDetailById({orgId, contractId: contractId}))
      setStep(prev => prev + 1)

    } else {
      toast.error(t('工作信息保存错误') || '', { position: 'top-center' })
    }
  }

  return (
    <Box sx={{ my: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <DatePickerWrapper>
                  <FormControl fullWidth>
                    <Controller
                      name='planEntryDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          selected={value}
                          id='basic-input'
                          popperPlacement={popperPlacement}
                          onChange={(e) => {
                            onChange(e);
                            console.log(e)
                          }}
                          placeholderText='合同生效日期'
                          customInput={<CustomInput label='合同生效日期' />}
                        />
                      )}
                    />
                    {errors.planEntryDate && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.planEntryDate.message}</FormHelperText>
                    )}
                  </FormControl>
                </DatePickerWrapper>
              </Grid>
              <TypographyTitleStyled sx={{paddingLeft: 5}}>
                定义账单周期
              </TypographyTitleStyled>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.paymentCycle)} htmlFor='paymentCycle'>
                    {t('账单周期')}
                  </InputLabel>
                  <Controller
                    name='paymentCycle'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('支付周期')}
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                          setValue('endTime', e.target.value === 'monthly' ? 'last' : '6')
                          setValue('paymentDeadline', '0')
                        }}
                        error={Boolean(errors.paymentCycle)}
                        aria-describedby='paymentCycle'
                      >
                        {paymentCycleList.map((o: any) => (
                          <MenuItem key={o.id} value={o.id}>{o.value}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.paymentCycle && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.paymentCycle.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.currency)} htmlFor='currency'>
                    {t('Currency')}
                  </InputLabel>
                  <Controller
                    name='currency'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Currency')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.currency)}
                        aria-describedby='currency'
                      >
                        {currencyList.map((o: {id: string, value: string}) => (
                          <MenuItem value={o.id}>{o.value}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.currency && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.currency.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <Controller
                    name='fixedValue'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('每次费用')}
                        placeholder={t('每次费用') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.fixedValue)}
                        aria-describedby='fixedValue'
                      />
                    )}
                  />
                  {errors.fixedValue && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.fixedValue.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <TypographyTitleStyled sx={{paddingLeft: 5}}>账单设置</TypographyTitleStyled>
          <CardContent>
            {
              getValues('paymentCycle') !== '3' && <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  mb: 5
                }}
              >
                <Alert
                  icon={false}
                  severity='info'
                  sx={theme => ({
                    width: '100%',
                    backgroundColor: '#F9FBFF',
                    '.MuiAlert-message': {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }
                  })}
                >
                  <Box>
                    <TypographyDescStyled sx={{ mb: 1 }} variant='body1'>
                      自定义账单周期
                    </TypographyDescStyled>
                    <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                      开启右侧开关，进行自定义账单周期
                    </TypographyDescStyled>
                  </Box>
                  <FormControlLabel
                    label=''
                    control={<Switch checked={checkedCustomCycle} onChange={(e, val) => { setCheckedCustomCycle(!checkedCustomCycle)}} />}
                  />
                </Alert>
              </Box>
            }
            <Grid item xs={12}>
              <Grid item xs={12} sx={{mb: 5, mt: 5}}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.endTime)} htmlFor='endTime'>
                    {t('账单周期结束于')}
                  </InputLabel>
                  <Controller
                    name='endTime'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('账单周期结束于')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.endTime)}
                        aria-describedby='endTime'
                        disabled={!checkedCustomCycle}
                      >
                        {(getValues('paymentCycle') === 'monthly' ? temp1 : temp2).map((o: any) => (
                          <MenuItem key={o.id} value={o.id}>{o.value}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.endTime && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.endTime.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{mb: 5}}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.paymentDeadline)} htmlFor='paymentDeadline'>
                    {t('付款截止日期')}
                  </InputLabel>
                  <Controller
                    name='paymentDeadline'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('付款截止日期')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.paymentDeadline)}
                        aria-describedby='paymentDeadline'
                        disabled={!checkedCustomCycle}
                      >
                        {(paymentDeadlineList.filter(v => getValues('paymentCycle') === 'monthly' || Number(v.id) < 7)).map((o: any) => (
                          <MenuItem key={o.id} value={o.id}>{o.value}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.paymentDeadline && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.paymentDeadline.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
        <Grid item sx={{borderRadius: 1, py:5, px: 5, backgroundColor: '#fff', mb: 5, boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)'}}>
          <TypographyTitleStyled>
          {t('Contract end date')}
          </TypographyTitleStyled>
          <Grid sx={{fontSize: 12, fontWeight: 400, color: '#3A3541DE', mb: 5}}>
            定义合同结束日期
          </Grid>
          <Grid item xs={12} sx={{mb: 10}}>
            <DatePickerWrapper>
              <FormControl fullWidth>
                <Controller
                  name='contractEndDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      id='basic-input'
                      popperPlacement={popperPlacement}
                      onChange={(e) => {
                        onChange(e);
                        console.log(e)
                      }}
                      placeholderText={t('Contract end date')}
                      customInput={<CustomInput label={t('Contract end date')} />}
                    />
                  )}
                />
              </FormControl>
            </DatePickerWrapper>
          </Grid>
        </Grid>
        <Card sx={{mb: 5}}>
          <CardContent>
            <TypographyTitleStyled>
              合同终止的通知期
            </TypographyTitleStyled>
            <TypographyDescStyled sx={{ mb: 4 }} variant='body1'>
              任何一方均可提前 10 天通知终止本合同。
            </TypographyDescStyled>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='contractFinishBufferDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label={t('通知期')}
                      placeholder={t('通知期') || ''}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.contractFinishBufferDate)}
                      aria-describedby='contractFinishBufferDate'
                    />
                  )}
                />
                {errors.contractFinishBufferDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.contractFinishBufferDate.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </CardContent>
        </Card>
      </form>
      <Grid item xs={12}>
        <Button size='large' variant='contained' sx={{ width: '100%' }} onClick={onSubmit}>
          {t('Staff.Next_step')}
        </Button>
      </Grid>
    </Box>
  )
}

export default Step2
