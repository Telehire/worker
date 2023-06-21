// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Snackbar from '@mui/material/Snackbar'
import { styled, useTheme } from '@mui/material/styles'
import Toast from 'src/components/toast'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

import { common } from '@mui/material/colors'
import Icon from '../../../../@core/components/icon'

import IconButton from '@mui/material/IconButton'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '../../../forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface IProps {
  onClose: () => void
  show: boolean
  onSure: any
  organizations: any
}
enum Step {
  One = 1,
  Two = 2,
  Three = 3
}

interface FormInputs {
  paymentCurrency: string
  monthlySalary: string
  stocksNumbers: string
  entity: string
}

interface BelongFormInputs {
  dateOfBelong: Date
  scheduleOfBelong: string
  belongList: Array<{ cycle: number, quantity: string }>
}



export const Stocks = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onClose, show, onSure, organizations } = props
  const [step, setStep] = useState<Step>(Step.One)
  const [openMes, setOpenMes] = useState<boolean>(false)

  const defaultValues = {
    paymentCurrency: 'CNY',
    stocksNumbers: '',
    monthlySalary: '',
    entity: '',
  }


  const schema = yup.object().shape({
    paymentCurrency: yup.string().min(2).required(),
    monthlySalary: yup.number().min(2).required(),
    stocksNumbers: yup.number().required(),
  })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  const saveStock = ()=>{
    const tempParams = {
        currency: getValues('paymentCurrency'),
        entityId: getValues('entity'),
        quantity: Number(getValues('stocksNumbers')),
        value: getValues('monthlySalary'),
        vestingCycle: Number(belongGetValues('scheduleOfBelong')),
        vestingDay: belongGetValues('dateOfBelong').getTime(),
        vestingList: [{}],
    }
    if(!tempParams.entityId) {
      return
    }
    let quantity = 0
    const vestList = belongGetValues('belongList')
    const tempList = vestList.map((vest:any)=>{
      quantity += vest.quantity
      return { cycle:Number(vest.cycle),quantity:Number(vest.quantity) }
    })
    tempParams.vestingList = tempList
    tempParams.quantity = quantity
    onSure(tempParams)
    onClose()
  }


  const belongDefaultValues = {
    dateOfBelong: new Date(),
    scheduleOfBelong: '12',
    belongList: [
      {
        cycle: 12,
        quantity: ''
      }
    ]
  }

  const belongSchema = yup.object().shape({
    dateOfBelong: yup.date().required(),
    scheduleOfBelong: yup.string().min(2).required(),
    belongList: yup.array().required().test('belongList', '请正确填写股权', function () {
      const total = getValues('stocksNumbers');
      let calcTotal = 0;
      let calcDate = 0;
      let hasEmpty
      this.parent.belongList.forEach((v: any) => {
        calcTotal += Number(v.quantity);
        calcDate += v.cycle
        if(!v.cycle || !Number(v.quantity)) {
          hasEmpty = true
        }
      })
      return Number(total) === Number(calcTotal) && Number(calcDate) === Number(this.parent.scheduleOfBelong) && !hasEmpty
    })
  })

  const checkInput = async () => {
    const valid = await belongTrigger(['dateOfBelong', 'scheduleOfBelong', 'belongList'])
    if(valid) {
      setStep(Step.Three)
    }
  }

  const handleBack = () => {
    if(step === Step.One) {
      onClose()
    }else {
      setStep(step - 1)
    }
  }

  const {
    control: belongControl,
    handleSubmit: belongHandleSubmit,
    getValues: belongGetValues,
    trigger: belongTrigger,
    formState: { errors: belongErrors }
  } = useForm<BelongFormInputs>({ defaultValues: belongDefaultValues, mode: 'onBlur', resolver: yupResolver(belongSchema) })
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [_, setNumber] = useState(0);

  const Cell = ({ title, value, time = '' }: { title: string, value: string, time?: string }) => (
    <Grid container>
      <Grid item xs={4}>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ color: theme.palette.text.primary, fontSize: 14, fontWeight: 500 }}>
          {value}
        </Typography>
        {time &&
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
          {value}
        </Typography>
        }
      </Grid>
    </Grid>
  )


  const StocksFirstPage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 6,
        mt: 5
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 11
        }}
      >
        <Box></Box>
        <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
          {t('添加股票/期权')}
        </Typography>
        <IconButton
          size='small' onClick={onClose}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}><Alert severity="info" sx={{ width: '100% !important' }}>{t('股票期权需要得到董事会的批准,并且授予期权需要单独的合同形式')}</Alert></Grid>
        <Grid item xs={12} >
          <Typography gutterBottom sx={{ fontSize: '14px', mb: 2, mt: 1.5 }}>
            {t('填写您将添加的股票期权的合约')}
          </Typography>
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
                <Select label={t('Currency')} value={value} onChange={onChange}>
                  <MenuItem value="USD">{t('美元')}</MenuItem>
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
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('股票/期权价值')}
                  placeholder={t('股票/期权价值') || ''}
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

        <Grid item xs={12} >
          <Typography gutterBottom sx={{ fontSize: '14px', mb: 2, mt: 1.5 }}>
            {t('具体代表多少股票期权？')}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name='stocksNumbers'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('股票/期权数量')}
                  placeholder={t('股票/期权数量') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.stocksNumbers)}
                  aria-describedby='employeeName'
                />
              )}
            />
            {errors.stocksNumbers && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.stocksNumbers.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', mt: 9 }}>
        <Typography gutterBottom variant='overline' sx={{ fontSize: 14, mr: 6, color: theme.palette.text.secondary }}>
          {`${t('步骤')}：${step}/3`}
        </Typography>
        <Button size='large' type='submit' variant='contained' onClick={handleSubmit(() => setStep(Step.Two))}>
          {t('Next step')}
        </Button>
      </Box>
    </Box>
  )

  const StocksSecondPage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DatePickerWrapper>
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box onClick={handleBack} sx={{ color: theme.palette.text.primary, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Icon icon='material-symbols:arrow-back-rounded' />
              <Typography sx={{ ml: 2, fontSize: 14 }} variant='overline'>
                {t('Register.Back')}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
              {t('添加股票/期权')}
            </Typography>
            <IconButton
              size='small' onClick={onClose}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container  sx={{ background: theme.palette.customColors.background3, borderRadius: 2, px: 6, py: 3, mb: 6 }}>
            <Cell title={t('综合股票/期权价值')} value={t(`${getValues('monthlySalary')}`)}/>
            <Cell title={t('Currency')} value={t(`${getValues('paymentCurrency')}`)}/>
            <Cell title={t('股票/期权数量')} value={t(`${getValues('stocksNumbers')}`)}/>
          </Grid>

          <Grid container spacing={4}>

            <Grid item xs={12}>
              <Typography gutterBottom sx={{ fontSize: 14, mb: 2, mt: 1.5 }}>
                {t('填写您将添加的股票期权的合约')}
              </Typography>
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
                  name='dateOfBelong'
                  control={belongControl}
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
                {belongErrors.dateOfBelong && (
                  <FormHelperText sx={{ color: 'error.main' }}>{belongErrors.dateOfBelong.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom sx={{ fontSize: 14, mb: 2, mt: 1.5 }}>
                {t('归属时间表')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(belongErrors.scheduleOfBelong)} htmlFor='scheduleOfBelong'>
                  {t('总月数')}
                </InputLabel>
                <Controller
                  name='scheduleOfBelong'
                  control={belongControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label={t('Staff.Webwork_city')}
                      value={value}
                      onChange={onChange}
                      error={Boolean(belongErrors.scheduleOfBelong)}
                      aria-describedby='employeeWorkCity'
                    >
                      <MenuItem value={12}>12个月后</MenuItem>
                      <MenuItem value={24}>24个月后</MenuItem>
                      <MenuItem value={36}>36个月后</MenuItem>
                      <MenuItem value={48}>48个月后</MenuItem>
                    </Select>
                  )}
                />
                {belongErrors.scheduleOfBelong && (
                  <FormHelperText sx={{ color: 'error.main' }}>{belongErrors.scheduleOfBelong.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

          </Grid>

          {
            belongGetValues('belongList').map((val:any, index:number) => (
              <Grid xs={12} container key={index} spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor={`belongList.${index}.cycle`}>
                      {t(`第${index + 1}次归属`)}
                    </InputLabel>
                    <Controller
                      name={`belongList.${index}.cycle`}
                      control={belongControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={`第${index + 1}次归属`}
                          value={value}
                          error={Boolean(belongErrors.belongList)}
                          onChange={onChange}
                          aria-describedby={`belongList.${index}.cycle`}
                        >
                          <MenuItem value={12}>12个月后</MenuItem>
                          <MenuItem value={24}>24个月后</MenuItem>
                          <MenuItem value={36}>36个月后</MenuItem>
                          <MenuItem value={48}>48个月后</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <Controller
                      name={`belongList.${index}.quantity`}
                      control={belongControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          placeholder={t('归属的数量') || ''}
                          value={value}
                          error={Boolean(belongErrors.belongList)}
                          onChange={onChange}
                          aria-describedby={`belongList.${index}.quantity`}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {belongErrors.belongList && (
                  <FormHelperText sx={{ color: 'error.main' }}>{belongErrors.belongList.message}</FormHelperText>
                )}
                {
                  index !== 0 && (<Grid item sm={1}>
                  <Button variant="text" size="small" onClick={() => {
                    const temp = [...belongGetValues('belongList')];
                    temp.splice(index, 1);
                    belongControl._updateFieldArray('belongList', [...temp])
                    setNumber(pre => pre - 1)
                  }}>
                    删除
                  </Button>
                  </Grid>)
                }
              </Grid>
            ))
          }

          <Box
            onClick={() => {
              belongControl._updateFieldArray('belongList', [...belongGetValues('belongList'), { cycle: '', quantity: '' }])
              console.log(belongGetValues('belongList'), '123')
              setNumber(pre => pre + 1)
            }}
            sx={{ background: theme.palette.customColors.background1, color: theme.palette.primary.main, py: 2, lienHeight: 24, width: '100%', textAlign: 'center', mt: 6, cursor: 'pointer' }}
          >
            {`添加第${belongGetValues('belongList').length + 1}次归属`}
          </Box>
        </DialogContent>

      </DatePickerWrapper>
      <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center' }}>
        <Typography gutterBottom variant='overline' sx={{ fontSize: 14, mr: 6, color: theme.palette.text.secondary }}>
          {`${t('步骤')}：${step}/3`}
        </Typography>
        <Button size='large' type='submit' variant='contained' onClick={handleSubmit(() => {checkInput()})}>
          {t('Next step')}
        </Button>
      </DialogActions>
    </Box>
  )

  const StocksThreePage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 6,
        mt: 5
      }}
    >
      <DatePickerWrapper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5
          }}
        >
          <Box onClick={() => setStep(Step.Two)} sx={{ color: theme.palette.text.primary, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Icon icon='material-symbols:arrow-back-rounded' />
            <Typography sx={{ ml: 2, fontSize: 14 }} variant='overline'>
              {t('Register.Back')}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            {t('添加股票/期权')}
          </Typography>
          <IconButton
            size='small' onClick={onClose}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Grid container  sx={{ background: theme.palette.customColors.background3, borderRadius: 2, px: 6, py: 3, mb: 6 }}>
          <Cell title={t('综合股票/期权价值')} value={t(`${getValues('monthlySalary')}`)}/>
          <Cell title={t('Currency')} value={t(`${getValues('paymentCurrency')}`)}/>
          <Cell title={t('股票/期权数量')} value={t(`${getValues('stocksNumbers')}`)}/>
        </Grid>

        <Grid container  sx={{ background: theme.palette.customColors.background3, borderRadius: 2, px: 6, py: 3, mb: 6 }}>
          <Cell title={t('归属开始日期')} value={`2023年 3月 10日`}/>
          <Cell title={t('归属总月数')} value={belongGetValues('scheduleOfBelong')}/>
          {belongGetValues('belongList').map((val:any, index) => (
            <Cell title={`第一次股票`} value={`归属数量：${val.quantity}`} time={val.cycle}/>
          ))}
        </Grid>

        <Grid container>
          <Typography sx={{ mb: 5, fontSize: 14 }}>
            {t('确认发放股票/期权的实体')}
          </Typography>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.entity)} htmlFor='entity'>
                {t('Entity')}
              </InputLabel>
              <Controller
                name='entity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Entity')}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.entity)}
                    aria-describedby='entity'
                  >
                    {
                      organizations.map((o: any) => (
                        <MenuItem value={o.entiryId}>{o.entiryName}</MenuItem>
                      ))
                    }

                  </Select>
                )}
              />
              {errors.entity && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.entity.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', mt: 9 }}>
          <Typography gutterBottom variant='overline' sx={{ fontSize: 14, mr: 6, color: theme.palette.text.secondary }}>
            {`${t('步骤')}：${step}/3`}
          </Typography>
          <Button size='large' type='submit' variant='contained' onClick={handleSubmit(saveStock)}>
            {t('确定添加')}
          </Button>
        </Box>
      </DatePickerWrapper>
    </Box>
  )

  return (
    <Dialog
      open={show}
      onClose={onClose}
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
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center' }}
        open={openMes}
        sx={{width: 400}}
        autoHideDuration={60000}
        onClose={() => {setOpenMes(false)}}
      >
        <Alert severity="error">分期设定不规范</Alert>
      </Snackbar>
      {step === Step.One ? <StocksFirstPage /> : step === Step.Two ? <StocksSecondPage /> : <StocksThreePage />}
    </Dialog>
  )
}
