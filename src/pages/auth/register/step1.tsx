// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect, Fragment, useRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import SendMail from 'src/views/pages/auth/send-mails/SendMails'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { setLocale } from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { common } from '@mui/material/colors'
import { RegisterParams } from '../../../context/types'
import { FormControlLabel } from '@mui/material'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import DialogPrivacy from 'src/views/components/dialogs/DialogPrivacy'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import { REGISTER_VERIFY_TYPE } from '../../../enums/registerEnum'
import RedirectLogin from '../../../views/pages/auth/redirect-login/RedirectLogin'
import LogoText from '../../../components/svg/LogoText'
import Hidden from '@mui/material/Hidden'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'
import { LOGIN_TYPE, REGISTER_TYPE } from '@/enums/loginEnum'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import toast from 'react-hot-toast'
import Head from 'next/head'

setLocale({
  // use constant translation keys for messages without values
  mixed: {
    default: 'field_invalid'
  },

  // use functions to generate an error object that includes the value from the schema
  number: {
    min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } })
  }
})

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

const ToggleButtonGroupStyled = styled(ToggleButtonGroup)(({ theme }) => ({
  background: '#F5F7FA',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  padding: '4px',
  justifyContent: 'space-between',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    fontSize: '1rem',
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

const ToggleButtonStyled = styled(ToggleButton)(({ theme }) => ({
  width: '50%',
  fontSize: '1rem',
  '&.Mui-selected': {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.common.white
    }
  },
  '&:not(.Mui-selected)': {
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const defaultValues = {
  enterpriseName: '',
  enterpriseEmail: '',
  contactName: '',
  phoneNumber: '',
  phoneVerifyCode: '',
  password: ''
}

const emailDefaultValues = {
  emailEnterpriseName: '',
  emailContactName: '',
  email: ''
}

const RegisterStep1Page = () => {
  const [hasRegistered, setHasRegistered] = useState(false)
  const [hasAgreePrivacy, setHasAgreePrivacy] = useState(false)
  const [showAgreeDialog, setShowAgreeDialog] = useState(false)
  const [registerType, setRegisterType] = useState<string>('EMAIL')
  const [needWait, setNeedWait] = useState<number>(30)
  const [hasSendEmail, setHasSendEmail] = useState<boolean>(false)
  const [formParams, setFormParams] = useState<any>({})
  const { t, i18n } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const { login } = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { skin } = settings
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')

  let timer: any

  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      setDefaultCountry(i18n.language.replace('zh_', '') as MuiTelInputCountry)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
    } else {
      setDefaultCountry(i18n.language.toUpperCase() as unknown as MuiTelInputCountry)
    }
  }, [i18n.language])

  const schema = yup.object().shape({
    enterpriseName: yup.string().min(2).required(),
    contactName: yup.string().min(2).required(),
    phoneNumber: yup
      .string()
      .required()
      .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
        return matchIsValidTel(value)
      }),
    phoneVerifyCode: yup.string().min(6).required(),
    enterpriseEmail: yup.string().email().required()
  })

  const emailSchema = yup.object().shape({
    emailEnterpriseName: yup.string().min(2).required(),
    emailContactName: yup.string().min(2).required(),
    email: yup.string().email().required()
  })

  useEffect(() => {
    intervalSetWaitSendSms()
  }, [])

  const {
    control: Control,
    setError: setError,
    handleSubmit: handleSubmit,
    getValues,
    trigger,
    unregister,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const {
    control: EmailControl,
    setError: EmailSetError,
    handleSubmit: EmailHandleSubmit,
    getValues: EmailGetValues,
    trigger: EmailTrigger,
    clearErrors: EmailClearErrors,
    formState: { errors: EmailErrors }
  } = useForm({
    defaultValues: emailDefaultValues,
    mode: 'onBlur',
    resolver: yupResolver(emailSchema)
  })

  const intervalSetWaitSendSms = () => {
    clearTimeout(timer)
    const wait = localStorage.getItem('HasSendSmsRegister')
    if (wait && Number(wait) && Number(wait) > 0) {
      setNeedWait(Number(JSON.parse(wait)))
      timer = setTimeout(() => {
        localStorage.setItem('HasSendSmsRegister', JSON.stringify(Number(JSON.parse(wait)) - 1))
        intervalSetWaitSendSms()
      }, 1000)
    } else {
      setNeedWait(0)
    }
  }

  const loadErrorCallback = () => {
    console.log('报错了')
  }

  const callback = async (res: any) => {
    if (res.ret === 0) {
      setNeedWait(30)
      localStorage.setItem('HasSendSmsRegister', JSON.stringify(30))
      clearTimeout(timer)
      intervalSetWaitSendSms()
      auth.sendSms(
        {
          phoneNumber: getValues('phoneNumber'),
          template: 'REGISTER',
          site: 'biz-gateway'
        },
        err => {
          let message = ''
          if (err.code === 'MOBILE_CONFLICT') {
            message = t('该手机号码已注册，请前往登录')
          }
          setError('phoneVerifyCode', {
            type: 'manual',
            message: err ? message : 'sending sms failed'
          })
        }
      )
    }
  }

  const onSendSms = async () => {
    try {
      const valid = await trigger(['phoneNumber'])
      if (valid) {
        // 生成一个验证码对象
        // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
        //callback：定义的回调函数
        const { TencentCaptcha } = window as any
        if (TencentCaptcha) {
          const captcha = new TencentCaptcha('194503754', callback, {})

          // 调用方法，显示验证码
          captcha.show()
        }
      }
    } catch (error) {
      // 加载异常，调用验证码js加载错误处理函数
      loadErrorCallback()
    }
  }

  const handleCheckPrivacy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasAgreePrivacy(event.target.checked)
  }

  const handleCloseDialog = () => {
    setShowAgreeDialog(false)
  }

  const handleApprovePrivacy = () => {
    setHasAgreePrivacy(true)
  }

  const handleRejectPrivacy = () => {
    setHasAgreePrivacy(false)
  }

  const onSubmitBySms = (data: RegisterParams) => {
    const { phoneNumber, phoneVerifyCode, enterpriseName, enterpriseEmail, contactName } = data
    if (!hasAgreePrivacy) {
      setShowAgreeDialog(true)
      return
    }

    // 保存联系人姓名等待成功页面消费
    localStorage.setItem('REGISTER_ENTERPRISE_NAME', JSON.stringify(enterpriseName))

    auth.registerBySms(
      {
        checkType: REGISTER_VERIFY_TYPE.SMS,
        phoneNumber,
        phoneVerifyCode,
        enterpriseName,
        enterpriseEmail,
        contactName
      },
      err => {
        setError('phoneVerifyCode', {
          type: 'manual',
          message: err ? err.message : 'register request failed'
        })

        /*setError('phoneNumber', {
          type: 'manual',
          message: '该手机号已经注册，现在去'
        })
        setHasRegistered(true)*/
      }
    )
  }

  const onSubmitByEmail = async () => {
    // unregister('phoneVerifyCode')
    const valid = await EmailTrigger(['emailEnterpriseName', 'email', 'emailContactName'])
    if (valid) {
      if (!hasAgreePrivacy) {
        setShowAgreeDialog(true)
        return
      }

      // 保存联系人姓名等待成功页面消费
      localStorage.setItem('REGISTER_ENTERPRISE_NAME', JSON.stringify(EmailGetValues('emailContactName')))

      const params = {
        checkType: REGISTER_VERIFY_TYPE.EMAIL,
        enterpriseName: EmailGetValues('emailContactName'),
        enterpriseEmail: EmailGetValues('email'),
        contactName: EmailGetValues('emailContactName'),
        lan: i18n.language
      }
      setFormParams(params)
      setHasSendEmail(true)
      auth.registerByEmail(params, err => {
        EmailSetError('email', {
          type: 'manual',
          message: err ? err.message : 'register request failed'
        })

        /*setError('phoneNumber', {
            type: 'manual',
            message: '该手机号已经注册，现在去'
          })
          setHasRegistered(true)*/
      })
    }
  }

  const handleRegisterTypeChange = (event: MouseEvent<HTMLElement>, newLoginType: string) => {
    clearErrors()
    EmailClearErrors()
    setRegisterType(newLoginType)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center'
        },
        '.register-sidebar': {
          height: '100vh'
        }
      }}
    >
      <Head>
        <script src='/js/TCaptcha.js' async />
      </Head>
      <Sidebar hidden={hidden} hiddenExceptLogo={true} />

      <RedirectLogin sx={{ position: 'absolute', right: '2.5rem', top: '1.5rem' }} />

      {hasSendEmail ? (
        <SendMail
          isRegister={true}
          handleBack={() => {
            setHasSendEmail(false)
          }}
          reSend={() => {
            onSubmitByEmail()
          }}
          currentEmail={formParams.enterpriseEmail}
        />
      ) : (
        <Grid
          spacing={6}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid item xl={6} lg={6} md={6} sm={11} xs={11}>
            <Box
              sx={{
                px: 6,
                [theme.breakpoints.up('sm')]: {
                  width: '29rem'
                }
              }}
            >
              <Box sx={{ mb: 6, mt: 20 }}>
                <TypographyStyled variant='h5'> {t('Register.Register')} </TypographyStyled>
              </Box>

              <Box sx={{ mb: 8 }}>
                <ToggleButtonGroupStyled
                  exclusive
                  value={registerType}
                  onChange={handleRegisterTypeChange}
                  aria-label='text alignment'
                >
                  <ToggleButtonStyled value={REGISTER_TYPE.EMAIL} aria-label='right aligned'>
                    {t('邮箱注册')}
                  </ToggleButtonStyled>
                  <ToggleButtonStyled value={REGISTER_TYPE.SMS} aria-label='left aligned'>
                    {t('手机注册')}
                  </ToggleButtonStyled>
                </ToggleButtonGroupStyled>
              </Box>
              {registerType === REGISTER_TYPE.SMS && (
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmitBySms)}>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='enterpriseName'
                          control={Control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              sx={{ backgroundColor: common.white }}
                              label={t('Register.Company_name')}
                              value={value}
                              onChange={onChange}
                              error={Boolean(errors.enterpriseName)}
                              placeholder={t('Register.Company_name') || ''}
                            />
                          )}
                        />
                        {errors.enterpriseName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.enterpriseName.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='contactName'
                          control={Control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              id='123123'
                              label={t('Register.Contact_name')}
                              sx={{ backgroundColor: common.white }}
                              value={value}
                              onChange={onChange}
                              error={Boolean(errors.contactName)}
                              placeholder={t('Register.Contact_name') || ''}
                            />
                          )}
                        />
                        {errors.contactName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.contactName.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='phoneNumber'
                          control={Control}
                          render={({ field }) => (
                            <MuiTelInputStyled
                              {...field}
                              error={Boolean(errors.phoneNumber)}
                              defaultCountry={defaultCountry || 'CN'}
                              preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE']}
                              forceCallingCode
                              focusOnSelectCountry
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors.phoneNumber && (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center'
                            }}
                          >
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>
                            {hasRegistered && (
                              <LinkStyled
                                sx={{ fontSize: '0.75rem', lineHeight: 1.66, marginTop: '0.25rem' }}
                                href='/auth/login'
                              >
                                {t('Register.Log_in')}
                              </LinkStyled>
                            )}
                          </Box>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='phoneVerifyCode'
                          control={Control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Box>
                              <TextField
                                sx={{ backgroundColor: common.white, width: '100%' }}
                                label={t('Register.Mobile_verification_code')}
                                value={value}
                                onChange={e => {
                                  console.log(e.target.value)
                                  onChange(e.target.value)
                                }}
                                error={Boolean(errors.phoneVerifyCode)}
                                placeholder={t('Register.Mobile_verification_code') || ''}
                              />

                              <Button
                                onClick={onSendSms}
                                disabled={!!needWait}
                                sx={{
                                  position: 'absolute',
                                  right: 13,
                                  top: 7,
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer',
                                  '&.MuiTypography-body1': {
                                    '&:hover': {
                                      color: theme.palette.primary.dark
                                    }
                                  }
                                }}
                              >
                                {!needWait ? `${t('Login.Send_verification_code')}` : `${needWait}秒`}
                              </Button>
                            </Box>
                          )}
                        />
                        {errors.phoneVerifyCode && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneVerifyCode.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='enterpriseEmail'
                          control={Control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              sx={{ backgroundColor: common.white }}
                              label={t('Register.Enterprise_email')}
                              value={value}
                              onChange={onChange}
                              error={Boolean(errors.enterpriseEmail)}
                              placeholder={t('Register.Enterprise_email') || ''}
                            />
                          )}
                        />
                        {errors.enterpriseEmail && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.enterpriseEmail.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    fullWidth
                    size='large'
                    type='submit'
                    disabled={hasRegistered}
                    variant='contained'
                    sx={{ mt: 7, mb: 7 }}
                  >
                    {t('Register.Continue')}
                  </Button>
                </form>
              )}
              {registerType === REGISTER_TYPE.EMAIL && (
                <form noValidate autoComplete='off' onSubmit={EmailHandleSubmit(onSubmitByEmail)}>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='emailEnterpriseName'
                          control={EmailControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              sx={{ backgroundColor: common.white }}
                              label={t('Register.Company_name')}
                              value={value}
                              onChange={onChange}
                              error={Boolean(EmailErrors.emailEnterpriseName)}
                              placeholder={t('Register.Company_name') || ''}
                            />
                          )}
                        />
                        {EmailErrors.emailEnterpriseName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {EmailErrors.emailEnterpriseName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='emailContactName'
                          control={EmailControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label={t('Register.Contact_name')}
                              sx={{ backgroundColor: common.white }}
                              value={value}
                              onChange={onChange}
                              error={Boolean(EmailErrors.emailContactName)}
                              placeholder={t('Register.Contact_name') || ''}
                            />
                          )}
                        />
                        {EmailErrors.emailContactName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {EmailErrors.emailContactName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='email'
                          control={EmailControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              sx={{ backgroundColor: common.white }}
                              label={t('Register.Enterprise_email')}
                              value={value}
                              onChange={onChange}
                              error={Boolean(EmailErrors.email)}
                              placeholder={t('Register.Enterprise_email') || ''}
                            />
                          )}
                        />
                        {EmailErrors.email && (
                          <FormHelperText sx={{ color: 'error.main' }}>{EmailErrors.email.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    fullWidth
                    size='large'
                    type='submit'
                    disabled={hasRegistered}
                    variant='contained'
                    sx={{ mt: 7, mb: 7 }}
                  >
                    {t('Register.Continue')}
                  </Button>
                </form>
              )}
              <FormControlLabel
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                control={<Checkbox checked={hasAgreePrivacy} onChange={handleCheckPrivacy} />}
                label={
                  <Fragment>
                    <span>{t('Register.Continue')} </span>
                    <LinkStyled href='/' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      {t('Register.Service_items')}
                    </LinkStyled>
                    <span> {t('Register.And')} </span>
                    <LinkStyled href='/' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      {t('Register.Privacy_policy')}
                    </LinkStyled>
                  </Fragment>
                }
              />
            </Box>
          </Grid>
        </Grid>
      )}

      <DialogPrivacy
        open={showAgreeDialog}
        onClose={handleCloseDialog}
        onApprove={handleApprovePrivacy}
        onReject={handleRejectPrivacy}
      />
    </Box>
  )
}

RegisterStep1Page.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterStep1Page.guestGuard = true

export default RegisterStep1Page
