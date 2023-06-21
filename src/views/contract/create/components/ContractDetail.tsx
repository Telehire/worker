import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Controller, useForm} from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {styled, useTheme} from "@mui/material/styles";
import * as yup from "yup";
import {Radio, RadioGroup, Switch, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Alert} from "@mui/lab";
import FormControlLabel from "@mui/material/FormControlLabel";
import CleaveWrapper from "@/@core/styles/libs/react-cleave";
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {TypographyProps} from "@mui/material/Typography";
import {ChangeEvent, useEffect, useState} from 'react'
import Cleave from "cleave.js/react";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {fetchCustomJobScope, fetchJobScope, fetchJobTitle} from "@/store/apps/job";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import {fetchConfigByLng} from "@/store/apps/config";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";

interface Iprops{
  handleClose: any
  defaultInfo: any
}

interface JobTitleOption {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

type TitleOptionType = {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

const TypographyDescStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '0.875rem',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const TypographyTitleStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '1.1rem',
  fontWeight: '600',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

interface DialogFormInputs {
  employmentType: string,
  weeklyWorkHours: string | number,
  planEntryDate: Date,
  jobTitle: string,
  paidVacationType: string,
  paidVacationDays: string,
  probationEndDate: Date,
}

const filter = createFilterOptions<JobTitleOption>()

const SalaryForm = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [showPartTimeHoursPerWeek, setShowPartTimeHoursPerWeek] = useState<boolean>(false)
  const [paidVacationType, setPaidVacationType] = useState<string>('')
  const [currentDays, setCurrentDays] = useState<string>('')
  const [currentCountry, setCurrentCountry] = useState<boolean>(false)
  const [needProbation, setNeedProbation] = useState<boolean>(false)
  const [jobTitleOptions, setJobTitleOptions] = useState<TitleOptionType[]>([])
  const [jobTitle, setJobTitle] = useState<JobTitleOption | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  const GroupHeader = styled('div')(({ theme }) => ({
    padding: '4px 10px',
    color: theme.palette.primary.main
  }))
  const GroupItems = styled('ul')({
    padding: 0
  })

  const { config, salaryConfig } = useSelector((state: RootState) => state.config)
  const {
    jobTitleList: { basicJobTitleTree, popularJobTitles },
    jobScopeList,
    customJobScopeList
  } = useSelector((state: RootState) => state.job)

  useEffect(() => {
    dispatch(fetchJobTitle({}))
  }, [dispatch])

  useEffect(() => {
    if (basicJobTitleTree) {
      const titles: TitleOptionType[] = popularJobTitles.map((pj: { rkey: any; rvalue: any }) => {
        return {
          categoryCode: '',
          categoryName: t('经常使用'),
          titleKey: pj.rkey,
          titleName: pj.rvalue,
          inputValue: ''
        }
      })

      basicJobTitleTree.forEach((a: any) => {
        a.jobTitles.forEach((j: any) => {
          const jt = {
            categoryCode: a.categoryCode,
            categoryName: a.categoryName,
            titleKey: j.rkey,
            titleName: j.rvalue,
            inputValue: ''
          }
          titles.push(jt)
        })
      })
      setJobTitleOptions(titles)
    }
  }, [basicJobTitleTree])
  const schemaDialog = yup.object().shape({
  })

  const defaultValues = {
    employmentType: '',
    weeklyWorkHours: '',
    jobTitle: '',
    paidVacationType: '',
    paidVacationDays: '',
  }

  const {
    control,
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })
  const getCurrentDayConfig = async ()=>{
    const { payload:{ data } } = await dispatch(
      fetchConfigByLng({
        rgroup: 'page.contract.eor.create.CN',
        rkey: 'standard.paid.vacation'
      })
    )
    setCurrentDays(data.rvalue)
    setValue('paidVacationDays',data.rvalue)
  }

  useEffect(() => {
    getCurrentDayConfig()
    dispatch(
      fetchConfigByLng({
        rgroup: 'full-time.weekly.working.hours',
        rkey: i18n.language.startsWith('zh_') ? i18n.language.replace('zh_', '') : i18n.language.toUpperCase()
      })
    )

    if (defaultInfo.needProbation === 1) {
      setNeedProbation(true)
    }
    setValue('employmentType', defaultInfo.employmentType)
    setValue('weeklyWorkHours', defaultInfo.weeklyWorkHours)
    setValue('planEntryDate', new Date(defaultInfo.planEntryDate || new Date()) )
    setValue('jobTitle', defaultInfo.jobTitle)
    setValue('paidVacationType', defaultInfo.paidVacationType)
    setJobTitle(defaultInfo.jobTitle)
    setPaidVacationType(defaultInfo.paidVacationType)
    setValue('paidVacationDays', defaultInfo.paidVacationDays)
    setValue('probationEndDate', new Date(defaultInfo.probationEndDate || new Date()))
    console.log(defaultInfo)
  },[defaultInfo])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'employmentType') {
        setShowPartTimeHoursPerWeek(getValues('employmentType') === 'part-time')
      }

      trigger(name)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const handleSubmit = async() => {
    const arrToTrigger = [
      'employmentType',
      'weeklyWorkHours',
      'planEntryDate',
      'jobTitle',
      'paidVacationType',
      'paidVacationDays',
      'probationEndDate'
    ]

    // @ts-ignore
    const valid = await trigger(arrToTrigger)
    console.log(valid, errors)
    if (valid) {
      const params = {
        action: 'PREVIEW-SAVE',
        contractId: defaultInfo.contractId,
        orgId: defaultInfo.orgId,
        teamId: defaultInfo.teamId,
        type: 'EOR',
        jobTitle: {
          entiryId: defaultInfo.entiryId,
          teamId: defaultInfo.teamId,
          jobTitle: getValues('jobTitle'),
          jobDuty: defaultInfo.jobDuty
        },
        salary: {
          employmentType: getValues('employmentType'),
          salaryCurrency: defaultInfo.salaryCurrency,
          salaryAmount: String(defaultInfo.salaryAmount / 1000),
          salaryFiguredPeriod: 'monthly',
          planEntryDate: getValues('planEntryDate')?.getTime() || 0,
          paidVacationType: getValues('paidVacationType'),
          paidVacationDays: Number(getValues('paidVacationDays')),
          contractTermType: defaultInfo.contractTermType,
          contractEndDate: defaultInfo.contractEndDate,
          needProbation: needProbation,
          probationEndDate:  getValues('probationEndDate')?.getTime() || 0,
          weeklyWorkHours: getValues('paidVacationType') === 'standard' ? (config as any)?.rvalue : (Number(getValues('weeklyWorkHours')) || 0),
          signingBonus: defaultInfo.signingBonus,
          variablePay: {
            title: defaultInfo.variablePayInfo.title,
            startDay: defaultInfo.variablePayInfo.startDay,
            type: defaultInfo.variablePayInfo.type,
            fixedValue: defaultInfo.variablePayInfo.fixedValueLong ? String(defaultInfo.variablePayInfo.fixedValueLong / 1000) : '',
            percentageValue: defaultInfo.variablePayInfo.percentageValueLong ? String(defaultInfo.variablePayInfo.percentageValueLong / 1000) : '',
            period: defaultInfo.variablePayInfo.period,
            currency: defaultInfo.variablePayInfo.currency,
          },
          regularAllowance: {
            title: defaultInfo.regularAllowanceInfo.title,
            period: defaultInfo.regularAllowanceInfo.period,
            amount: defaultInfo.regularAllowanceInfo.amountLong ? String(defaultInfo.regularAllowanceInfo.amountLong / 1000) : '',
            currency: defaultInfo.regularAllowanceInfo.currency,

            //TODO
          }
        }
      }
      console.log(params)
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract(params)
      )
      if (code === 'SUCCESS') {
        await dispatch(getContractDetailById({orgId: defaultInfo.orgId, contractId: defaultInfo.contractId}));
        handleClose()
      } else if(code === 'INVALID_PARAMETER') {
        toast.error(error, { position: 'top-right' })
      }
    }
    console.log()
  }
  const handlePaidHolidayTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('paidVacationType', (event.target as HTMLInputElement).value)
    setPaidVacationType((event.target as HTMLInputElement).value)
  }

  return (
    <Grid item xs={12} sx={{py: 4.5, px: 6}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 6,
        }}
      >
        {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
        <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
          编辑合同详情
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off'>
        <Grid item xs={12} sx={{mb: 10}}>
          <TypographyTitleStyled>{t('Employment Type')}</TypographyTitleStyled>
          <FormControl>
            <Controller
              name={'employmentType'}
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup row defaultValue={'full-time'} value={value} onChange={onChange} sx={{mb: 4}}>
                  <FormControlLabel value='full-time' control={<Radio checked={getValues('employmentType') === 'full-time'} />} label={t('Full-time')} />
                  <FormControlLabel value='part-time' control={<Radio checked={getValues('employmentType') === 'part-time'} />} label={t('Part-time')} />
                </RadioGroup>
              )}
            />
          </FormControl>
          {showPartTimeHoursPerWeek ? (
            <FormControl fullWidth>
              <Controller
                name={'weeklyWorkHours'}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('每周兼职时长')}
                    placeholder={t('每周兼职时长') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.weeklyWorkHours)}
                    aria-describedby='weeklyWorkHours'
                  />
                )}
              />
              {errors.weeklyWorkHours && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.weeklyWorkHours.message}
                </FormHelperText>
              )}
            </FormControl>
          ) : (
            <TypographyDescStyled variant='body2'>
              在{currentCountry}，全职员工每周的标准工作时间是 {(config as any)?.rvalue} 小时
            </TypographyDescStyled>
          )}
        </Grid>
        <Grid item xs={12} sx={{mb: 6}}>
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
              name='planEntryDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <DatePickerWrapper>
                  <DatePicker
                    selected={value}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={onChange}
                    placeholderText='请选择期望入职日期'
                    customInput={<CustomInput label={t('Desired Start Date')} />}
                  />
                </DatePickerWrapper>
              )}
            />
            {errors.planEntryDate && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.planEntryDate.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 5}}>
          <FormControl fullWidth>
            <Autocomplete
              freeSolo
              clearOnBlur
              value={jobTitle}
              selectOnFocus
              handleHomeEndKeys
              options={jobTitleOptions}
              groupBy={(option: any) => option.categoryName}
              renderGroup={params => (
                <li className={'job-title'} key={params.key}>
                  <GroupHeader>{params.group}</GroupHeader>
                  <GroupItems>{params.children}</GroupItems>
                </li>
              )}
              renderInput={params => <TextField {...params} label={t('Staff.Employee_job_title')} />}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option || ''
                }
                if ((option as JobTitleOption).inputValue as string) {
                  return ((option as JobTitleOption).inputValue as string) || ''
                }

                return (option.titleName as string) || ''
              }}
              onChange={async (event, newValue) => {
                if (typeof newValue === 'string') {
                  setJobTitle({
                    titleName: newValue
                  })
                  setValue('jobTitle', newValue)
                  dispatch(fetchJobScope({ keywords: newValue }))
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setJobTitle({
                    titleName: newValue.titleName
                  })
                  setValue('jobTitle', newValue.titleName || '')
                } else {
                  setJobTitle({
                    titleName: newValue?.titleName
                  })
                  setValue('jobTitle', newValue?.titleName || '')
                  dispatch(fetchJobScope({ keywords: newValue?.titleName }))
                }

                await trigger('jobTitle')
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params)
                const { inputValue } = params

                // Suggest the creation of a new value
                const isExisting = options.some(option => inputValue === option.titleName)
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue: `添加 "${inputValue}"`,
                    titleName: inputValue,
                    titleKey: '',
                    categoryCode: '',
                    categoryName: ''
                  })
                }
                return filtered
              }}
            />
            {errors.jobTitle && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.jobTitle.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 5}}>
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
              name={'paidVacationType'}
              control={control}
              rules={{ required: true }}
              render={() => (
                <RadioGroup row value={paidVacationType} onChange={handlePaidHolidayTypeChange}>
                  <FormControlLabel value='standard' control={<Radio checked={paidVacationType === 'standard'} />} label={t('Standard')} />
                  <FormControlLabel value='customization' control={<Radio checked={paidVacationType === 'customization'} />} label={t('Custom')} />
                </RadioGroup>
              )}
            />
            {errors.paidVacationType && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.paidVacationType.message}</FormHelperText>
            )}
          </FormControl>

          {paidVacationType === 'standard' && (
            <>
              <Divider sx={{ width: '100%', mb: '10px!important' }} />

              <TypographyDescStyled variant='body2' sx={{ mb: 0 }}>
                中国标准带薪休假 { currentDays } 天
              </TypographyDescStyled>
            </>
          )}

          {paidVacationType === 'customization' && (
            <FormControl fullWidth sx={{ mt: 5 }}>
              <Controller
                name={'paidVacationDays'}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('Paid Vacation')}
                    placeholder={t('Paid Vacation') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.paidVacationDays)}
                    aria-describedby='paidVacationDays'
                  />
                )}
              />
              {errors.paidVacationDays && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.paidVacationDays.message}</FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12}>
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
                  name='probationEndDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        selected={value}
                        showYearDropdown
                        showMonthDropdown
                        onChange={e => onChange(e)}
                        placeholderText='MM/DD/YYYY'
                        customInput={<CustomInput label={t('End date of probationary period')} />}
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.probationEndDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.probationEndDate.message}
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
        </Grid>
        <Grid container justifyContent='flex-end'>
          <Button size='large' variant='outlined' onClick={handleClose}>
            {t('取消')}
          </Button>
          <Button size='large' variant='contained' sx={{ ml: 3 }} onClick={() => {handleSubmit()}}>
            {t('继续')}
          </Button>
        </Grid>
      </form>

    </Grid>
  )
}
export default SalaryForm

