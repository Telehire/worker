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
import DatePicker from "react-datepicker";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {TypographyProps} from "@mui/material/Typography";
import { useEffect, useState } from 'react'
import Cleave from "cleave.js/react";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";

interface DialogFormInputs {
  paymentCurrency: string,
  monthlySalary: string,
  signBonus: string
}

interface Iprops{
  handleClose: any
  defaultInfo: any
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

const SalaryForm = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [addSignBonusChecked, setAddSignBonusChecked] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })

  const defaultValues = {
    paymentCurrency: '',
    monthlySalary: '',
    signBonus: ''
  }

  useEffect(() => {
    setValue('paymentCurrency', defaultInfo.salaryCurrency)
    setValue('monthlySalary', String(defaultInfo.salaryAmount / 1000))
    setAddSignBonusChecked(!!defaultInfo.signingBonus)
    if(!!defaultInfo.signingBonus) {
      setValue('signBonus', String(defaultInfo.signingBonus / 1000))
    }
    console.log(defaultInfo)
  },[defaultInfo])


  const {
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  const handleSubmit = async() => {
      const arrToTrigger = [
        'paymentCurrency',
        'monthlySalary',
        'signBonus',
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
            salaryCurrency: getValues('paymentCurrency'),
            salaryAmount: getValues('monthlySalary'),
            salaryFiguredPeriod: 'monthly',
            planEntryDate: defaultInfo.planEntryDate,
            paidVacationType: defaultInfo.paidVacationType,
            paidVacationDays: defaultInfo.paidVacationDays,
            contractTermType: defaultInfo.contractTermType,
            contractEndDate: defaultInfo.contractEndDate,
            needProbation: defaultInfo.needProbation,
            probationEndDate: defaultInfo.probationEndDate,
            weeklyWorkHours: defaultInfo.weeklyWorkHours,
            signingBonus: getValues('signBonus')?.replace('¥', '').replace(',', ''),
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

  const handleSignBonusChange = () => {
    setAddSignBonusChecked(!addSignBonusChecked)
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
          编辑薪资明细
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off' >
        <Typography sx={{fontSize: 16, fontWeight: 600, color: '#3A3541DE',mb: 2 }}>
          工资
        </Typography>
        <Typography sx={{fontSize: 12, fontWeight: 400,  color: '##3A354199', mb: 6 }}>
          所有工资将以 USD-美元 支付。由于合规性，合同货币不可在 EOR 中自定义。
        </Typography>
        <Grid container sx={{mb: 9}}>
          <Grid item sm={3} xs={12}>
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
          <Grid item xs={0.4} />
          <Grid item sm={8.6} xs={12}>
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
        </Grid>

        <Grid item xs={12}>
          <TypographyTitleStyled>{t('Other Salary Types')}</TypographyTitleStyled>
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
                  添加签约奖金
                </TypographyDescStyled>
                <TypographyDescStyled sx={{ mb: 0, fontSize: '0.875rem' }} variant='body2'>
                  作为员工第一笔工资的一部分，一次性支付给员工
                </TypographyDescStyled>
              </Grid>
              <FormControlLabel
                label=''
                control={<Switch checked={addSignBonusChecked} onChange={handleSignBonusChange} />}
              />
            </Grid>

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

