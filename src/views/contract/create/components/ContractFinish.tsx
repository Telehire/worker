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
import {common} from "@mui/material/colors";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";

interface DialogFormInputs {
  contractTermType: string,
  contractEndDate: Date,
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


const SalaryForm = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const dispatch = useDispatch<AppDispatch>()
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [contractTermType, setContractTermType] = useState<string>()
  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })

  const defaultValues = {
    contractTermType: '',
  }

  useEffect(() => {
    setValue('contractTermType', defaultInfo.contractTermType)
    setContractTermType(defaultInfo.contractTermType)
    setValue('contractEndDate', new Date(defaultInfo.contractEndDate || new Date()))
  },[defaultInfo])


  const {
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  const handleSubmit = async() => {
    const valid = await trigger(['contractTermType', 'contractEndDate']);
    if(valid) {
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
          contractTermType: getValues('contractTermType'),
          contractEndDate: getValues('contractEndDate')?.getTime() || 0,
          needProbation: defaultInfo.needProbation,
          probationEndDate: defaultInfo.probationEndDate,
          weeklyWorkHours: defaultInfo.weeklyWorkHours,
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
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract(params)
      )
      if (code === 'SUCCESS') {
        await dispatch(getContractDetailById({orgId: '1', contractId: defaultInfo.contractId}));
        handleClose()
      } else if(code === 'INVALID_PARAMETER') {
        toast.error(error, { position: 'top-right' })
      }
    }
  }

  const handleContractTermTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('contractTermType', event.target.value)
    setContractTermType((event.target as HTMLInputElement).value)
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
          编辑合同期限
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off' >
        <Grid item sm={12} xs={12}>
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
                name='contractEndDate'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={value}
                      popperPlacement={popperPlacement}
                      onChange={e => onChange(e)}
                      placeholderText='MM/DD/YYYY'
                      customInput={<CustomInput label={t('Contract end date')} />}
                    />
                  </DatePickerWrapper>
                )}
              />
              {errors.contractEndDate && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.contractEndDate.message}</FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
        <Grid container justifyContent='flex-end' sx={{mt: 10}}>
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

