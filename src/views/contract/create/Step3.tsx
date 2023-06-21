// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { ChangeEvent, Dispatch, forwardRef, SetStateAction, useEffect, useState } from 'react'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { lighten, styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Radio, RadioGroup, Switch } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from '../../forms/form-elements/pickers/PickersCustomInput'
import Divider from '@mui/material/Divider'
import { Alert } from '@mui/lab'
import Cleave from 'cleave.js/react'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { setConfig } from '../../../store/apps/config'
import toast from 'react-hot-toast'
import {getContractDetailById, saveEorContract} from '../../../store/apps/contract'
import { filterCountrySupported } from '../../../@core/utils/filter-country-supported'
import {GET_CONFIG_WITH_LNG} from "@/apis";
import axios from "axios";

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
}

interface FormInputs {
  employType: string
  partTimeHoursPerWeek: string
  contractTermType: string
  dateOfAboard: DateType
  dateOfEndContract: DateType
  dateOfEndProbationPeriod: DateType
  paymentCurrency: string
  signBonus: string
  annualVariablePayTitle: string
  dateOfAnnualVariablePayEffect: DateType
  annualVariablePayType: string
  annualVariablePayValue: string
  annualVariablePayPayRate: string
  fixedAllowanceTitle: string
  fixedAllowanceType: string
  fixedAllowanceValue: string
  paidHolidayType: string
  paidHolidayDays: string
  monthlySalary: string
}

const TypographyTitleStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '1.1rem',
  fontWeight: '600',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const TypographyDescStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '0.875rem',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  textAlign: 'left',
  height: '50px !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))


const Step3 = ({ setStep, orgId, contractId }: Props) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [contractTermType, setContractTermType] = useState('')
  const [paidHolidayType, setPaidHolidayType] = useState('')
  const [addSignBonusChecked, setAddSignBonusChecked] = useState(false)
  const [addAnnualVariablePayChecked, setAddAnnualVariablePayChecked] = useState(false)
  const [addFixedAllowanceChecked, setAddFixedAllowanceChecked] = useState(false)
  const [showFixAmountInput, setShowFixAmountInput] = useState(false)
  const [showPartTimeHoursPerWeek, setShowPartTimeHoursPerWeek] = useState(false)
  const [needProbation, setNeedProbation] = useState(true)
  const [countries, setCountries] = useState([])
  const [currentCountry, setCurrentCountry] = useState('')
  const [currentDays, setCurrentDays] = useState('')

  const defaultValues = {
    employType: 'full-time',
    partTimeHoursPerWeek: '',
    dateOfAboard: new Date(),
    dateOfEndContract: new Date(),
    dateOfEndProbationPeriod: new Date(),
    signBonus: '',
    annualVariablePayTitle: '',
    dateOfAnnualVariablePayEffect: new Date(),
    annualVariablePayType: '',
    annualVariablePayValue: '',
    annualVariablePayPayRate: '',
    fixedAllowanceTitle: '',
    fixedAllowanceType: '',
    fixedAllowanceValue: '',
    paymentCurrency: 'CNY',
    paidHolidayDays: '5',
    monthlySalary: ''
  }

  yup.setLocale({
    number: {
      min: '长度最少为 ${min}',
    },
  });

  const schema = yup.object().shape({
    employType: yup.string().required(),
    partTimeHoursPerWeek: yup.string().required(),
    dateOfAboard: yup.date().required(),
    dateOfEndContract: yup.date().required(),
    dateOfEndProbationPeriod: yup.date().required(),
    paymentCurrency: yup.string().required(),
    signBonus: yup.string().min(2).required(),
    annualVariablePayTitle: yup.string().required(),
    dateOfAnnualVariablePayEffect: yup.date().required(),
    annualVariablePayType: yup.string().required(),
    annualVariablePayValue: yup.number().required(),
    annualVariablePayPayRate: yup.string().required(),
    fixedAllowanceTitle: yup.string().required(),
    fixedAllowanceType: yup.string().required(),
    fixedAllowanceValue: yup.number().required(),
    paidHolidayDays: yup.number().required(),
    monthlySalary: yup.number().required()
      .test('monthlySalary', '月薪不得低于当地最低薪资', function() {
        return this.parent.monthlySalary > ((salaryConfig as any)?.rvalue || 0)
      }),
    contractTermType: yup.string().required(),
    paidHolidayType: yup.string().required(),
  })

  const {
    control,
    getValues,
    setValue,
    watch,
    register,
    setError,
    unregister,
    handleSubmit,
    clearErrors,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  const dispatch = useDispatch<AppDispatch>()
  const { config, salaryConfig } = useSelector((state: RootState) => state.config)
  const {
    currentContract
  } = useSelector((state: RootState) => state.contract)

  const { staff } = currentContract || {}
  const { staffWorkplaceCountry } = staff || {}

  useEffect(() => {
    getCurrentCountryConfig()

    // if (i18n.language === 'en') {
    //   setNeedProbation(false)
    // }
  }, [i18n])


  useEffect(() => {
    if(currentContract.employmentType) {
      setValue('employType', currentContract.employmentType);
      setValue('partTimeHoursPerWeek', currentContract.weeklyWorkHours);
      setValue('paymentCurrency', currentContract.salaryCurrency);
      setValue('monthlySalary', String(Number(currentContract.salaryAmount) / 1000));
      const {variablePayInfo = {}} = currentContract;
      if(variablePayInfo.title) {
        setAddAnnualVariablePayChecked(true)
        setValue('annualVariablePayTitle', variablePayInfo.title);
        setValue('dateOfAnnualVariablePayEffect', new Date(variablePayInfo.startDay));
        setValue('annualVariablePayType', variablePayInfo.type);
        setValue('annualVariablePayValue', variablePayInfo.type === '百分比' ? (Number(variablePayInfo.percentageValueLong) / 1000).toFixed(0): (Number(variablePayInfo.fixedValueLong) / 1000).toFixed(0));
        setValue('annualVariablePayPayRate', variablePayInfo.period);
      }
      const {regularAllowanceInfo = {}} = currentContract;
      if(regularAllowanceInfo.amountLong) {
        setAddFixedAllowanceChecked(true)
        setValue('fixedAllowanceTitle', regularAllowanceInfo.title);
        setValue('fixedAllowanceType', regularAllowanceInfo.period);
        setValue('fixedAllowanceValue', (Number(regularAllowanceInfo.amountLong) / 1000).toFixed(0));
      }
      setValue('dateOfAboard',  new Date(currentContract.planEntryDate))
      setValue('paidHolidayType',  currentContract.paidVacationType)
      setPaidHolidayType(currentContract.paidVacationType)
      setValue('paidHolidayDays',  currentContract.paidVacationDays)
      setValue('contractTermType',  currentContract.contractTermType)
      setContractTermType(currentContract.contractTermType)
      setValue('dateOfEndContract',  new Date(currentContract.contractEndDate))
      setValue('dateOfEndProbationPeriod',  new Date(currentContract.probationEndDate))
    }
  }, [currentContract])


  const getCurrentCountryConfig = () => {
    const getCurrentDay = axios.get(GET_CONFIG_WITH_LNG, {params: {
        rgroup: 'page.contract.eor.create.CN',
        rkey: 'standard.paid.vacation'
      }})
    const getCurrentWord = axios.get(GET_CONFIG_WITH_LNG, {params: {
        rgroup: 'full-time.weekly.working.hours',
        rkey: staffWorkplaceCountry
      }})
    Promise.all([getCurrentDay, getCurrentWord]).then(res => {
      dispatch(setConfig({
        currentDay: res[0].data.data,
        workingHour: res[1].data.data,
      }))
    })
  }



  const fetchCountries = () => {
    fetch('/locales/countries.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCountries(filterCountrySupported(data))
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    if (countries) {
      const currentCountryObj = countries.find(
        (c: any) =>
          c.iso2 === (i18n.language.startsWith('zh_') ? i18n.language.replace('zh_', '') : i18n.language.toUpperCase())
      )
      if (currentCountryObj) {
        const currentCountryI18n = (currentCountryObj as any).translations[
          i18n.language.startsWith('zh_') ? i18n.language.replace('zh_', '').toLowerCase() : i18n.language.toLowerCase()
        ]
        setCurrentCountry(currentCountryI18n)
      }
    }
  }, [countries])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'annualVariablePayType') {
        setShowFixAmountInput(getValues('annualVariablePayType') === '固定金额')
      }
      if (name === 'employType') {
        setShowPartTimeHoursPerWeek(getValues('employType') === 'part-time')
      }

      trigger(name)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const handleContractTermTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('contractTermType', event.target.value)
    setContractTermType((event.target as HTMLInputElement).value)
  }

  const handlePaidHolidayTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('paidHolidayType', (event.target as HTMLInputElement).value)
    setPaidHolidayType((event.target as HTMLInputElement).value)
  }

  const onError = (errs: { [x: string]: any }) => {
    Object.keys(errs).forEach((e: string) => {
      // @ts-ignore
      if (!errs[e].ref) {
        // @ts-ignore
        delete errors[e]

        // @ts-ignore
        unregister(e)
      }
    })
  }

  const onMySubmit = async () => {
    const arrToTrigger = [
      'employType',
      'dateOfAboard',
      'dateOfEndContract',
      'dateOfEndProbationPeriod',
      'paidHolidayDays',
      'contractTermType',
      'paymentCurrency',
      'monthlySalary',
      'paidHolidayType'
    ]
    if (showPartTimeHoursPerWeek) {
      arrToTrigger.concat(['partTimeHoursPerWeek'])
    }
    if (addSignBonusChecked) {
      arrToTrigger.concat(['signBonus'])
    }
    if (addAnnualVariablePayChecked) {
      arrToTrigger.concat([
        'annualVariablePayTitle',
        'annualVariablePayType',
        'dateOfAnnualVariablePayEffect',
        'annualVariablePayValue',
        'annualVariablePayPayRate'
      ])
    }
    if (addFixedAllowanceChecked) {
      arrToTrigger.concat(['fixedAllowanceTitle', 'fixedAllowanceType', 'fixedAllowanceValue'])
    }

    // @ts-ignore
    const valid = await trigger(arrToTrigger)
    console.log(valid, errors)
    if (valid) {
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract({
          action: 'SALARY',
          contractId,
          orgId,
          teamId: currentContract.teamId,
          type: 'EOR',
          salary: {
            employmentType: getValues('employType'),
            salaryCurrency: getValues('paymentCurrency'),
            salaryAmount: getValues('monthlySalary'),
            salaryFiguredPeriod: 'monthly',
            planEntryDate: getValues('dateOfAboard')?.getTime() || 0,
            paidVacationType: getValues('paidHolidayType'),
            paidVacationDays: Number(getValues('paidHolidayDays')) || 0,
            contractTermType: getValues('contractTermType'),
            contractEndDate: getValues('dateOfEndContract')?.getTime() || 0,
            needProbation,
            probationEndDate: getValues('dateOfEndProbationPeriod')?.getTime() || 0,
            weeklyWorkHours: getValues('paidHolidayType') ===  'standard'? (config.workingHour as any)?.rvalue : (Number(getValues('partTimeHoursPerWeek')) || 0),
            signingBonus: getValues('signBonus').replace('¥', '').replace(',', ''),
            variablePay: {
              title: getValues('annualVariablePayTitle'),
              startDay: getValues('dateOfAnnualVariablePayEffect')?.getTime() || 0,
              type: getValues('annualVariablePayType'),
              fixedValue: getValues('fixedAllowanceValue'),
              percentageValue: getValues('fixedAllowanceValue'),
              period: getValues('annualVariablePayPayRate'),

              //TODO
              currency: 'CNY'
            },
            regularAllowance: {
              title: getValues('fixedAllowanceTitle'),
              period: getValues('fixedAllowanceType'),
              amount: getValues('fixedAllowanceValue'),

              //TODO
              currency: 'CNY'
            }
          }
        })
      )
      if (code === 'SUCCESS') {
        await dispatch(getContractDetailById({orgId: '1', contractId}));
        setStep(prev => prev + 1)
      } else {
        toast.error(error, { position: 'top-right' })
      }
    }
  }

  const handleSignBonusChange = () => {
    setAddSignBonusChecked(!addSignBonusChecked)
  }

  const handleAnnualVariablePayChange = () => {
    setAddAnnualVariablePayChecked(!addAnnualVariablePayChecked)
  }

  const handleFixedAllowanceChange = () => {
    setAddFixedAllowanceChecked(!addFixedAllowanceChecked)
  }

  return (
    <DatePickerWrapper>
      <form>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TypographyTitleStyled>{t('Employment Type')}</TypographyTitleStyled>

                <FormControl>
                  <Controller
                    name={'employType'}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup row defaultValue={'full-time'} value={value} onChange={onChange}>
                        <FormControlLabel value='full-time' control={<Radio />} label={t('Full-time')} />
                        <FormControlLabel value='part-time' control={<Radio />} label={t('Part-time')} />
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                <Divider sx={{ color: '#F2F6FC', width: '100%', mb: '10px!important' }} />

                {showPartTimeHoursPerWeek ? (
                  <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
                    <Controller
                      name={'partTimeHoursPerWeek'}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          label={t('每周兼职时长')}
                          placeholder={t('每周兼职时长') || ''}
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.partTimeHoursPerWeek)}
                          aria-describedby='partTimeHoursPerWeek'
                        />
                      )}
                    />
                    {errors.partTimeHoursPerWeek && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.partTimeHoursPerWeek.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                ) : (
                  <TypographyDescStyled variant='body2'>
                    在{currentCountry}，全职员工每周的标准工作时间是 {(config.workingHour as any)?.rvalue} 小时
                  </TypographyDescStyled>
                )}
              </Grid>

              <Grid item xs={12}>
                <TypographyTitleStyled sx={{ mb: 2 }}>{t('Wages')}</TypographyTitleStyled>
                <TypographyDescStyled sx={{ mb: 2 }} variant='body2'>
                  {t('All wages will be paid in CNY - Chinese Yuan. Due to compliance, the contract currency cannot be customized in the EOR.')}
                </TypographyDescStyled>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.paymentCurrency)} htmlFor='货币'>
                    {t('Currency')}
                  </InputLabel>
                  <Controller
                    name={'paymentCurrency'}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select label={t('Currency')} value={value} onChange={onChange} disabled>
                        <MenuItem value="CNY">{t('人民币')}</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.paymentCurrency && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.paymentCurrency.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={8} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name={'monthlySalary'}
                    control={control}
                    rules={{ required: true}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('Monthly Salary')}
                        placeholder={t('Monthly Salary') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.monthlySalary)}
                        aria-describedby='monthlySalary'
                      />
                    )}
                  />
                  {errors.monthlySalary && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.monthlySalary.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TypographyTitleStyled>{t('Other Salary Types')}</TypographyTitleStyled>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 4
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
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
                          添加签约奖金
                        </TypographyDescStyled>
                        <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                          作为员工第一笔工资的一部分，一次性支付给员工
                        </TypographyDescStyled>
                      </Box>
                      <FormControlLabel
                        label=''
                        control={<Switch checked={addSignBonusChecked} onChange={handleSignBonusChange} />}
                      />
                    </Alert>

                    {addSignBonusChecked && (
                      <CleaveWrapper sx={{ width: '100%', my: 4 }}>
                        <InputLabel htmlFor='sign-bonus' sx={{ px: 2, fontSize: '.75rem', maxWidth: 'max-content' }}>
                          总签约奖金
                        </InputLabel>
                        <Controller
                          name={'signBonus'}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Box
                              value={value}
                              component={CleaveInput}
                              onChange={onChange}
                              options={{ prefix: '¥', numeral: true, numeralPositiveOnly: true }}
                              sx={{
                                [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` }
                              }}
                            />
                          )}
                        />
                        {errors.signBonus && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.signBonus.message}</FormHelperText>
                        )}
                      </CleaveWrapper>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
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
                          添加年度可变薪酬
                        </TypographyDescStyled>
                        <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                          由雇主自行决定向雇员支付额外报酬
                        </TypographyDescStyled>
                      </Box>
                      <FormControlLabel
                        label=''
                        control={
                          <Switch checked={addAnnualVariablePayChecked} onChange={handleAnnualVariablePayChange} />
                        }
                      />
                    </Alert>

                    {addAnnualVariablePayChecked && (
                      <Grid container spacing={5} sx={{ my: 4 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <Controller
                              name={'annualVariablePayTitle'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  label={t('标题')}
                                  placeholder={t('标题(例如奖金、绩效奖金)') || ''}
                                  value={value}
                                  onChange={onChange}
                                  error={Boolean(errors.annualVariablePayTitle)}
                                  aria-describedby='annualVariablePayTitle'
                                />
                              )}
                            />
                            {errors.annualVariablePayTitle && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.annualVariablePayTitle.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl
                            fullWidth
                            sx={{
                              '&.MuiFormControl-root': {
                                position: 'initial'
                              },
                              '& .MuiFormControl-root': {
                                width: '100%'
                              }
                            }}
                          >
                            <Controller
                              name='dateOfAnnualVariablePayEffect'
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <DatePicker
                                  selected={value}
                                  id='basic-input'
                                  popperPlacement={popperPlacement}
                                  onChange={onChange}
                                  placeholderText='生效日期'
                                  customInput={<CustomInput label='生效日期' />}
                                />
                              )}
                            />
                            {errors.dateOfAnnualVariablePayEffect && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.dateOfAnnualVariablePayEffect.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                          <FormControl fullWidth>
                            <InputLabel error={Boolean(errors.annualVariablePayType)} htmlFor='annualVariablePayType'>
                              {t('类型')}
                            </InputLabel>
                            <Controller
                              name={'annualVariablePayType'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Select label={t('类型')} value={value} onChange={onChange}>
                                  <MenuItem value={'固定金额'}>{t('固定金额')}</MenuItem>
                                  <MenuItem value={'百分比'}>{t('百分比')}</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.annualVariablePayType && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.annualVariablePayType.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sm={8} xs={12}>
                          <FormControl fullWidth>
                            <Controller
                              name={'annualVariablePayValue'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) =>
                                showFixAmountInput ? (
                                  <TextField
                                    label={t('金额')}
                                    placeholder={t('金额') || ''}
                                    value={value}
                                    onChange={onChange}
                                    error={Boolean(errors.annualVariablePayValue)}
                                    aria-describedby='annualVariablePayValue'
                                  />
                                ) : (
                                  <TextField
                                    label={t('基础月薪百分比')}
                                    placeholder={t('基础月薪百分比') || ''}
                                    value={value}
                                    onChange={onChange}
                                    error={Boolean(errors.annualVariablePayValue)}
                                    aria-describedby='annualVariablePayValue'
                                  />
                                )
                              }
                            />
                            {errors.annualVariablePayValue && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.annualVariablePayValue.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel error={Boolean(errors.annualVariablePayPayRate)} htmlFor='支付频率'>
                              {t('支付频率')}
                            </InputLabel>
                            <Controller
                              name={'annualVariablePayPayRate'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Select label={t('支付频率')} value={value} onChange={onChange}>
                                  <MenuItem value={'每月'}>{t('每月')}</MenuItem>
                                  <MenuItem value={'每季度'}>{t('每季度')}</MenuItem>
                                  <MenuItem value={'每年'}>{t('每年')}</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.annualVariablePayPayRate && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.annualVariablePayPayRate.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
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
                          固定津贴
                        </TypographyDescStyled>
                        <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                          给员工的额外福利（例如搬家津贴、健康津贴等）
                        </TypographyDescStyled>
                      </Box>
                      <FormControlLabel
                        label=''
                        control={<Switch checked={addFixedAllowanceChecked} onChange={handleFixedAllowanceChange} />}
                      />
                    </Alert>

                    {addFixedAllowanceChecked && (
                      <Grid container spacing={5} sx={{ my: 4 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <Controller
                              name={'fixedAllowanceTitle'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  label={t('标题')}
                                  placeholder={t('标题（例如搬家津贴、健康津贴等）') || ''}
                                  value={value}
                                  onChange={onChange}
                                  error={Boolean(errors.fixedAllowanceTitle)}
                                  aria-describedby='fixedAllowanceTitle'
                                />
                              )}
                            />
                            {errors.fixedAllowanceTitle && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.fixedAllowanceTitle.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                          <FormControl fullWidth>
                            <InputLabel error={Boolean(errors.fixedAllowanceType)} htmlFor='fixedAllowanceType'>
                              {t('类型')}
                            </InputLabel>
                            <Controller
                              name={'fixedAllowanceType'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Select label={t('类型')} value={value} onChange={onChange}>
                                  <MenuItem value={'一次性'}>{t('一次性')}</MenuItem>
                                  <MenuItem value={'每月重复'}>{t('每月重复')}</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.fixedAllowanceType && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.fixedAllowanceType.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sm={8} xs={12}>
                          <FormControl fullWidth>
                            <Controller
                              name={'fixedAllowanceValue'}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  label={t('金额')}
                                  placeholder={t('金额') || ''}
                                  value={value}
                                  onChange={onChange}
                                  error={Boolean(errors.fixedAllowanceValue)}
                                  aria-describedby='fixedAllowanceValue'
                                />
                              )}
                            />
                            {errors.fixedAllowanceValue && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.fixedAllowanceValue.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>{t('Desired Start Date')}</TypographyTitleStyled>

            <TypographyDescStyled variant={'body2'}>
              {t('Due to regulatory requirements, the earliest possible start date for this contract is January 18, 2023. Please note that delays in providing proof of employment documentation by the employee may result in a later start date.')}
            </TypographyDescStyled>

            <FormControl
              fullWidth
              sx={{
                '&.MuiFormControl-root': {
                  position: 'initial'
                },
                '& .MuiFormControl-root': {
                  width: '100%'
                }
              }}
            >
              <Controller
                name='dateOfAboard'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={onChange}
                    placeholderText='请选择期望入职日期'
                    customInput={<CustomInput label={t('Desired Start Date')} />}
                  />
                )}
              />
              {errors.dateOfAboard && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.dateOfAboard.message}</FormHelperText>
              )}
            </FormControl>
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>{t('Paid Vacation')}</TypographyTitleStyled>

            {/* <Alert severity='info' sx={{ mb: 2 }}>
              我们建议使用标准、符合当地劳动法规定。如果您希望它们反映在员工合同中，则可能会增加押金。
            </Alert> */}

            <FormControl
              fullWidth
              sx={{
                '&.MuiFormControl-root': {
                  position: 'initial'
                },
                '& .MuiFormControl-root': {
                  width: '100%'
                }
              }}
            >
              <Controller
                name={'paidHolidayType'}
                control={control}
                rules={{ required: true }}
                render={() => (
                  <RadioGroup row value={paidHolidayType} onChange={handlePaidHolidayTypeChange}>
                    <FormControlLabel value='standard' control={<Radio checked={paidHolidayType === 'standard'} />} label={t('Standard')} />
                    <FormControlLabel value='customization' control={<Radio checked={paidHolidayType === 'customization'} />} label={t('Custom')} />
                  </RadioGroup>
                )}
              />
              {errors.paidHolidayType && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.paidHolidayType.message}</FormHelperText>
              )}
            </FormControl>

            {paidHolidayType === 'standard' && (
              <>
                <Divider sx={{ width: '100%', mb: '10px!important' }} />

                <TypographyDescStyled variant='body2' sx={{ mb: 0 }}>
                  中国标准带薪休假 { (config.currentDay as any)?.rvalue } 天
                </TypographyDescStyled>
              </>
            )}

            {paidHolidayType === 'customization' && (
              <FormControl fullWidth sx={{ mt: 5 }}>
                <Controller
                  name={'paidHolidayDays'}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label={t('Paid Vacation')}
                      placeholder={t('Paid Vacation') || ''}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.paidHolidayDays)}
                      aria-describedby='paidHolidayDays'
                    />
                  )}
                />
                {errors.paidHolidayDays && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.paidHolidayDays.message}</FormHelperText>
                )}
              </FormControl>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>{t('Length of contract')}</TypographyTitleStyled>

            <FormControl
              fullWidth
              sx={{
                '&.MuiFormControl-root': {
                  position: 'initial'
                },
                '& .MuiFormControl-root': {
                  width: '100%'
                }
              }}
            >
              <Controller
                name={'contractTermType'}
                control={control}
                rules={{ required: true }}
                render={() => (
                  <RadioGroup row value={contractTermType} onChange={handleContractTermTypeChange}>
                    <FormControlLabel value='fixed-term' control={<Radio checked={contractTermType === 'fixed-term'} />} label={t('Fixed term')} />
                    <FormControlLabel value='no-fixed-term' control={<Radio  checked={contractTermType === 'no-fixed-term'} />} label={t('Indefinite term')} />
                  </RadioGroup>
                )}
              />
              {errors.contractTermType && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.contractTermType.message}</FormHelperText>
              )}
            </FormControl>

            {contractTermType === 'fixed-term' && (
              <FormControl
                fullWidth
                sx={{
                  mt: 5,
                  '&.MuiFormControl-root': {
                    position: 'initial'
                  },
                  '& .MuiFormControl-root': {
                    width: '100%'
                  }
                }}
              >
                <Controller
                  name='dateOfEndContract'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => onChange(e)}
                      placeholderText='MM/DD/YYYY'
                      customInput={<CustomInput label={t('Contract end date')} />}
                    />
                  )}
                />
                {errors.dateOfEndContract && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.dateOfEndContract.message}</FormHelperText>
                )}
              </FormControl>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>{t('Probationary period')}</TypographyTitleStyled>
            {needProbation ? (
              <Box>
                <FormControl
                  fullWidth
                  sx={{
                    '&.MuiFormControl-root': {
                      position: 'initial'
                    },
                    '& .MuiFormControl-root': {
                      width: '100%'
                    }
                  }}
                >
                  <Controller
                    name='dateOfEndProbationPeriod'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        showYearDropdown
                        showMonthDropdown
                        onChange={e => onChange(e)}
                        placeholderText='MM/DD/YYYY'
                        customInput={<CustomInput label={t('End date of probationary period')} />}
                      />
                    )}
                  />
                  {errors.dateOfEndProbationPeriod && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.dateOfEndProbationPeriod.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <TypographyDescStyled variant='body2' sx={{ mt: 5, pb: 0, mb: 0 }}>
                  在{currentCountry}，试用期最少30天，最长不能超过180天
                </TypographyDescStyled>
              </Box>
            ) : (
              <TypographyDescStyled variant='body2' sx={{ mt: 5, pb: 0, mb: 0 }}>
                在{currentCountry}就业，不需要试用期
              </TypographyDescStyled>
            )}
          </CardContent>
        </Card>

        <Grid item xs={12}>
          <Button size='large' type='button' onClick={onMySubmit} variant='contained' sx={{ width: '100%' }}>
            {t('Next step')}
          </Button>
        </Grid>
      </form>
    </DatePickerWrapper>
  )
}

export default Step3
