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
import {Switch, Typography} from "@mui/material";
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
import { useEffect, useState } from 'react'
import Cleave from "cleave.js/react";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";

interface Iprops{
  handleClose: any
  defaultInfo: any
}

const TypographyDescStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '0.875rem',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

interface DialogFormInputs {
  annualVariablePayTitle: string,
  dateOfAnnualVariablePayEffect: Date,
  annualVariablePayType: string,
  annualVariablePayValue: string,
  annualVariablePayPayRate: string,
  annualVariablePayPayCurrency: string,
}

const SalaryForm = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const dispatch = useDispatch<AppDispatch>()
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [addAnnualVariablePayChecked, setAddAnnualVariablePayChecked] = useState<boolean>(false)
  const [showFixAmountInput, setShowFixAmountInput] = useState<boolean>(false)
  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })

  const defaultValues = {
    annualVariablePayTitle: '',
    annualVariablePayType: '',
    annualVariablePayValue: '',
    annualVariablePayPayRate: '',
    annualVariablePayPayCurrency: '',
  }

  useEffect(() => {
    if(defaultInfo.variablePayInfo && defaultInfo.variablePayInfo.title) {
      setAddAnnualVariablePayChecked(true)
      setValue('annualVariablePayTitle', defaultInfo.variablePayInfo.title)
      setValue('dateOfAnnualVariablePayEffect', new Date(defaultInfo.variablePayInfo.startDay || new Date()))
      setValue('annualVariablePayType', defaultInfo.variablePayInfo.type )
      setValue('annualVariablePayValue', defaultInfo.variablePayInfo.type === '固定金额' ? defaultInfo.variablePayInfo.fixedValueLong : defaultInfo.variablePayInfo.percentageValueLong)
      if(defaultInfo.variablePayInfo.type === '固定金额') {
        setShowFixAmountInput(true)
      }
      setValue('annualVariablePayPayRate', defaultInfo.variablePayInfo.period)
      setValue('annualVariablePayPayCurrency', defaultInfo.variablePayInfo.currency)
    }
    console.log(defaultInfo)
  },[defaultInfo])

  const {
    control,
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'annualVariablePayType') {
        setShowFixAmountInput(getValues('annualVariablePayType') === '固定金额')
      }
      trigger(name)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const handleAnnualVariablePayChange = () => {
    setAddAnnualVariablePayChecked(!addAnnualVariablePayChecked)
  }

  const handleSubmit = async() => {
    const arrToTrigger = [
      'annualVariablePayTitle',
      'dateOfAnnualVariablePayEffect',
      'annualVariablePayType',
      'annualVariablePayValue',
      'annualVariablePayPayRate',
      'annualVariablePayPayCurrency',
    ]

    // @ts-ignore
    const valid = await trigger(arrToTrigger)
    console.log(valid, errors)
    if (valid) {
      const params = {
        action: 'PREVIEW-SAVE',
        contractId: defaultInfo.contractId,
        orgId: defaultInfo.orgId,
        teamId: '1',
        type: 'EOR',
        salary: {
          employmentType: defaultInfo.employmentType,
          salaryCurrency: defaultInfo.salaryCurrency,
          salaryAmount: String(defaultInfo.salaryAmount / 1000),
          salaryFiguredPeriod: 'monthly',
          planEntryDate: defaultInfo.planEntryDate,
          paidVacationType: defaultInfo.paidVacationType,
          paidVacationDays: defaultInfo.paidVacationDays,
          contractTermType: defaultInfo.contractTermType,
          contractEndDate: defaultInfo.contractEndDate,
          needProbation: defaultInfo.needProbation,
          probationEndDate: defaultInfo.probationEndDate,
          weeklyWorkHours: defaultInfo.weeklyWorkHours,
          signingBonus: defaultInfo.signingBonus,
          variablePay: {
            title: getValues('annualVariablePayTitle'),
            startDay: getValues('dateOfAnnualVariablePayEffect')?.getTime() || 0,
            type: getValues('annualVariablePayType'),
            fixedValue: getValues('annualVariablePayValue'),
            percentageValue: getValues('annualVariablePayValue'),
            period: getValues('annualVariablePayPayRate'),

            //TODO
            currency: getValues('annualVariablePayPayCurrency')
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
      console.log(code)
      console.log(error)
      if (code === 'SUCCESS') {
        await dispatch(getContractDetailById({orgId: '1', contractId: defaultInfo.contractId}));
        handleClose()
      } else if(code === 'INVALID_PARAMETER') {
        toast.error(error, { position: 'top-right' })
      }
    }
    console.log()
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
          编辑年度可变薪酬
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off'>
        <Typography sx={{fontSize: 12, fontWeight: 400,  color: '##3A354199', mb: 6 }}>
          暂无设置年度可变薪酬，请打开下方开关进行设置
        </Typography>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          >
            <Grid  item xs={12} sx={{width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#F9FBFF', px: 4.5, py: 4,borderRadius: 1}}>
              <Grid item sx={{flex: 1}}>
                <TypographyDescStyled sx={{ mb: 1 }} variant='body1'>
                  添加年度可变薪酬
                </TypographyDescStyled>
                <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                  由雇主自行决定向雇员支付额外报酬
                </TypographyDescStyled>
              </Grid>
              <FormControlLabel
                label=''
                control={
                  <Switch checked={addAnnualVariablePayChecked} onChange={handleAnnualVariablePayChange} />
                }
              />
            </Grid>

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
                          placeholder={t('标题（例如奖金、绩效奖金）') || ''}
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
                        <DatePickerWrapper>
                          <DatePicker
                            selected={value}
                            id='basic-input'
                            popperPlacement={popperPlacement}
                            onChange={onChange}
                            placeholderText='生效日期'
                            customInput={<CustomInput label='生效日期' />}
                          />
                        </DatePickerWrapper>
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

