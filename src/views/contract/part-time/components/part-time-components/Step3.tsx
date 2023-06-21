// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { ChangeEvent, Dispatch, forwardRef, SetStateAction, useEffect, useState } from 'react'
import { DateType } from '@/types/forms/reactDatepickerTypes'

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
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { lighten, styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Radio, RadioGroup, Switch } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput'
import Divider from '@mui/material/Divider'
import { Alert } from '@mui/lab'
import Cleave from 'cleave.js/react'
import Dialog from '@mui/material/Dialog'

// ** Custom Styled Component
import CleaveWrapper from '@/@core/styles/libs/react-cleave'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchConfigByLng } from '@/store/apps/config'
import toast from 'react-hot-toast'
import { saveEorContract } from '@/store/apps/contract'
import { filterCountrySupported } from '@/@core/utils/filter-country-supported'
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
}

interface FormInputs {
  firstPayTime: DateType
  contractFinishTime: DateType
  notificationPeriod: number
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

const schema = yup.object().shape({
  firstPayTime: yup.date().required(),
  contractFinishTime: yup.date().required(),
  notificationPeriod: yup.number().required(),
})


const Step3 = ({ setStep, orgId, contractId }: Props) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [firstPayType, setFirstPayType] = useState<string>('1')
  const [customCost, setCustomCost] = useState<number | string>()
  const [showEditCalc, setShowEditCalc] = useState<boolean>(false)
  const [calcType, setCalcType] = useState<string>('')
  const [workWeekend, setWorkWeekend] = useState<string>('')

  const defaultValues = {
    firstPayTime: new Date(),
    notificationPeriod: 10,
    contractFinishTime: new Date(),
  }

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
  const { config } = useSelector((state: RootState) => state.config)
  const {
    currentFixedCostContract,
    fixedCostContract
  } = useSelector((state: RootState) => state.contract)
  const onMySubmit = async () => {
    // setStep(prev => prev + 1)
    const arrToTrigger = [
      'firstPayTime',
      'contractFinishTime',
      'notificationPeriod',
    ]

    // @ts-ignore
    const valid = await trigger(arrToTrigger)
    console.log('valid, errors)', valid, errors, fixedCostContract)
    if (valid) {
      const {
        payload: { code }
      } = await dispatch(
        saveEorContract({
          action: 'SALARY',
          contractId,
          orgId,
          teamId: currentFixedCostContract.teamId,
          type: 'temporary',
          salary: {
            ...fixedCostContract.salary,
            salaryCurrency: fixedCostContract.salary.invoiceRuleInfo.currency,
            salaryAmount: fixedCostContract.salary.invoiceRuleInfo.fixedValue
          }
        })
      )
      if (code === 'SUCCESS') {
        setStep(prev => prev + 1)
      } else {
        toast.error(t('工作信息保存错误') || '', { position: 'top-center' })
      }
    }
  }

  const greyGrid = (label: string, value: string) => {
    return <Grid item xs={12} sx={{display: 'flex', alignItems: 'center',padding: 4, backgroundColor: '#F9FAFC',mb: 3, borderRadius: 1}}>
      <Typography sx={{fontSize: 14, color: '#3A354199', minWidth: 140}}>{label}</Typography>
      <Typography sx={{fontSize: 14, color: '#3A3541DE', flex: 1}}>{value}</Typography>
    </Grid>
  }

  const cusRadio = (value: string | number, label: string, checked: boolean, onChange: any) => {
    return  <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
      <Radio size="small" checked={checked} onChange={(e,val) => {onChange(e, val, value)}} value={value}/>
      <Typography sx={{fontSize: 14, color: '#303133'}}>{label}</Typography>
    </Grid>
  }

  const handleSureCalc = () => {
    console.log('确定')
    setShowEditCalc(false)
  }

  return (
    <DatePickerWrapper>
      <form>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TypographyTitleStyled sx={{mb: 1}}>首次付款</TypographyTitleStyled>
                <TypographyDescStyled >定义承包商收到第一笔付款的日期。</TypographyDescStyled>
                <Grid item xs={12} sx={{mt: 5, pd: 4, mb: 2}}>
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
                      name='firstPayTime'
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
                          placeholderText='首次付款日期'
                          customInput={<CustomInput label='首次付款日期' />}
                        />
                      )}
                    />
                    {errors.firstPayTime && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.firstPayTime.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                {greyGrid('生效日期', '2023/01/17')}
                {greyGrid('账单周期结束于', '2023/01/31')}
                {greyGrid('付款截止日期', '同一天')}
              </Grid>
              <Grid item xs={12}>
                <TypographyTitleStyled sx={{mb: 2}}>首次付款</TypographyTitleStyled>
                <Grid container sx={{mb: 4}}>
                  {cusRadio('1', '自动计算金额', firstPayType === '1', (e: any, val: boolean, value: string) => {setFirstPayType(value)})}
                  {cusRadio('2', '全额', firstPayType === '2', (e: any, val: boolean, value: string) => {setFirstPayType(value)})}
                  {cusRadio('3', '自定义金额', firstPayType === '3', (e: any, val: boolean, value: string) => {setFirstPayType(value)})}
                </Grid>
                <TypographyDescStyled>第一笔付款是根据他们的开始日期到账单周期结束日之间的工作/日历天数计算的。</TypographyDescStyled>
                {
                  firstPayType === '1' && (
                    <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', borderRadius: 1, padding: 4}}>
                      <Box component='img' src='/images/contract/pencil.png' sx={{ width: 12, height: 12, ml: 2.5, mr: 4.5, cursor: 'pointer', }} onClick={() => {setShowEditCalc(true)}} />
                      <Grid item sx={{flex: 1}}>
                        <Typography sx={{fontSize: 14, color: '#303133'}}>11个工作日的工资</Typography>
                        <Typography sx={{fontSize: 12, color: '#909399', minWidth: 120}}>2023/01/17 到 2023/01/31</Typography>
                      </Grid>
                      <Typography sx={{fontSize: 14, color: '#303133', fontWeight: 500}}>$5000.00</Typography>
                    </Grid>
                  )
                }
                {
                  firstPayType === '2' && (
                    <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', borderRadius: 1, padding: 4}}>
                      <Grid item sx={{flex: 1}}>
                        <Typography sx={{fontSize: 14, color: '#303133'}}>一个月的费用</Typography>
                      </Grid>
                      <Typography sx={{fontSize: 14, color: '#303133', fontWeight: 500}}>$5000.00</Typography>
                    </Grid>
                  )
                }
                {
                  firstPayType === '3' && (
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          label="Amount"
                          value={customCost}
                          onChange={(e) => {
                            if(isNaN(Number(e.target.value))) {
                              setCustomCost(customCost)
                            }else {
                              setCustomCost(e.target.value)
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>合同终止的通知期</TypographyTitleStyled>
            <TypographyDescStyled variant={'body2'}>任何一方均可提前 10 天通知终止本合同。</TypographyDescStyled>
            <FormControl fullWidth>
              <Controller
                name='notificationPeriod'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('通知期')}
                    placeholder={t('通知期') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.notificationPeriod)}
                    aria-describedby='notificationPeriod'
                  />
                )}
              />
              {errors.notificationPeriod && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.notificationPeriod.message}</FormHelperText>
              )}
            </FormControl>
          </CardContent>
        </Card>
        <Card sx={{ mb: 5 }}>
          <CardContent>
            <TypographyTitleStyled>{t('Contract end date')}</TypographyTitleStyled>
            <TypographyDescStyled variant={'body2'}>定义合同结束日期</TypographyDescStyled>
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
                name='contractFinishTime'
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
                    placeholderText='结束日期'
                    customInput={<CustomInput label='结束日期' />}
                  />
                )}
              />
              {errors.contractFinishTime && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.contractFinishTime.message}</FormHelperText>
              )}
            </FormControl>
          </CardContent>
        </Card>

        <Grid item xs={12}>
          <Button size='large' type='button' onClick={onMySubmit} variant='contained' sx={{ width: '100%' }}>
            {t('Next step')}
          </Button>
        </Grid>
      </form>
      <Dialog
        open={showEditCalc}
        onClose={() => {setShowEditCalc(false)}}
        fullWidth
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 600 },
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 6,
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 5,
            }}
          >
            <Box>
            </Box>
            <Grid item>
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                {t('计算器')}
              </Typography>
              <TypographyDescStyled sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
                {t('首次付款')}
              </TypographyDescStyled>
            </Grid>
            <IconButton
              size='small' onClick={() => {setShowEditCalc(false)}}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
          <Typography  sx={{ fontSize: 14, fontWeight: 600, mb: 2}}>
            {t('定义计算器')}
          </Typography>
          <TypographyDescStyled sx={{ fontSize: 14, fontWeight: 400, mb: 8 }}>
            {t('选择计算类型和工作周以获得承包商的 第一笔付款的金额')}
          </TypographyDescStyled>
          <Grid item xs={12} sx={{mb: 6}}>
            <FormControl fullWidth>
              <InputLabel size='small'>{t('计算类型')}</InputLabel>
              <Select
                fullWidth
                size='small'
                label={t('计算类型')}
                value={calcType}
                onChange={(e) => {setCalcType(e.target.value)}}
                aria-describedby='calcType'
              >
                <MenuItem value="1">按工作日计算</MenuItem>
                <MenuItem value="2">按日历日计算</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {
            calcType === '1' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel size='small'>{t('工作周')}</InputLabel>
                  <Select
                    fullWidth
                    size='small'
                    label={t('工作周')}
                    value={workWeekend}
                    onChange={(e) => {setWorkWeekend(e.target.value)}}
                    aria-describedby='calcType'
                  >
                    <MenuItem value="1">从星期一到星期五</MenuItem>
                    <MenuItem value="2">从星期日到星期四</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )
          }
          <Typography  sx={{ fontSize: 14, fontWeight: 600, mb: 4, mt: 6}}>
            {t('明细')}
          </Typography>
          {greyGrid('每月费用', '$ 5,000')}
          {greyGrid('周期内的工作日', '4 天')}
          {greyGrid('每个工作日的费用', '$ 238.09')}
          <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F4F5FA', borderRadius: 1, padding: 4}}>
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 14, color: '#3A3541DE'}}>首次付款金额</Typography>
            </Grid>
            <Grid item textAlign="right">
              <Typography sx={{fontSize: 16, color: '#3A3541DE', fontWeight: 500}}>$ 952.38</Typography>
              <Typography sx={{fontSize: 14, color: '#3A354199', fontWeight: 400}}>2023年1月17日 - 1月31日</Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              mb: 6,
            }}
          >
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant='outlined' onClick={() => {setShowEditCalc(false)}} sx={{ ml: 3, width: '80px' }}>{t('取消')}</Button>
            <Button variant='contained' onClick={() => {handleSureCalc()}} sx={{ ml: 3, width: '80px' }}>{t('确定')}</Button>
          </Box>
        </Box>
      </Dialog>
    </DatePickerWrapper>
  )
}

export default Step3
