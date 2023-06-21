// ** React Imports
import {useState, ReactNode, MouseEvent, SetStateAction, useEffect, ChangeEvent, KeyboardEvent} from 'react'

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
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Head from 'next/head'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Dialog from '@mui/material/Dialog'
import axios from 'axios'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { LOGIN_TYPE, LOGIN_TYPE_PARAM } from 'src/enums/loginEnum'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useRouter } from 'next/router'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import { common } from '@mui/material/colors'
import MuiCard, { CardProps } from '@mui/material/Card'
import LogoText from 'src/components/svg/LogoText'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'
import CleaveWrapper from "@/@core/styles/libs/react-cleave";
import {hexToRGBA} from "@/@core/utils/hex-to-rgba";
import Cleave from "cleave.js/react";
import 'cleave.js/dist/addons/cleave-phone.us'
import {POST_EMAIL_CODE} from "@/apis";

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  marginRight: 20,
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%'
  }
}))

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

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

const LinkStyled2 = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.secondary.main
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

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  textAlign: 'center',
  height: '50px !important',
  fontSize: '150% !important',
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

interface FormDataPhone {
  phoneNumber?: string
  phoneVerifyCode?: string
}

interface FormDataAccount {
  account?: string
  password?: string
}

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}
let timer: any = null;

const LoginPage = () => {
  const [loginType, setLoginType] = useState<string>(LOGIN_TYPE.SMS)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [needWait, setNeedWait] = useState<number>(60)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const { t, i18n } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const imageSource = 'login-illustration'
  const { skin } = settings
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')

  const handleLoginTypeChange = (event: MouseEvent<HTMLElement>, newLoginType: string) => {
    setLoginType(newLoginType)
  }
  const {
    control: controlPhone,
    setError: setErrorPhone,
    handleSubmit: handleSubmitPhone,
    trigger,
    formState: { errors: errorsPhone },
    getValues
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      phoneVerifyCode: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        phoneNumber: yup
          .string()
          .required()
          .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
            if (value) {
              return matchIsValidTel(value)
            }
            return false
          }),
        phoneVerifyCode: yup.string().min(6).required()
      })
    )
  })

  const {
    control: controlAccount,
    setError: setErrorAccount,
    handleSubmit: handleSubmitAccount,
    getValues: getAccountValues,
    formState: { errors: errorsAccount }
  } = useForm({
    defaultValues: {
      account: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        account: yup.string().required(),
        password: yup.string().min(5).required()
      })
    )
  })

  const {
    control: controlEmail,
    setError: setErrorEmail,
    handleSubmit: handleSubmitEmailCode,
    getValues: getEmailCodeValues,
    formState: { errors: errorsEmail }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        account: yup.string().required(),
        password: yup.string().min(5).required()
      })
    )
  })

  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      setDefaultCountry(i18n.language.replace('zh_', '') as MuiTelInputCountry)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
    } else {
      setDefaultCountry(i18n.language.toUpperCase() as unknown as MuiTelInputCountry)
    }
  }, [i18n.language])

  useEffect(() => {
    intervalSetWaitSendSms();
  }, [])

  const intervalSetWaitSendSms = () => {
    clearTimeOutTimer();
    const wait = localStorage.getItem('HasSendSms');
    if(wait && (Number(wait) && Number(wait) > 0)) {
      setNeedWait(Number(JSON.parse(wait)))
      timer = setTimeout(() => {
        localStorage.setItem('HasSendSms', JSON.stringify(Number(JSON.parse(wait)) -1))
        intervalSetWaitSendSms()
      }, 1000)
    } else {
      setNeedWait(0)
    }
  }

  const onSubmitPhone = (data: FormDataPhone) => {
    const { phoneNumber, phoneVerifyCode } = data
    clearTimeOutTimer()
    auth.login({ loginType: LOGIN_TYPE_PARAM.MOBILE_VCODE, phoneNumber, phoneVerifyCode }, err => {
      setErrorPhone('phoneVerifyCode', {
        type: 'manual',
        message: err ? err.message : 'phoneNumber or verifyCode is invalid'
      })
    })
  }

  const clearTimeOutTimer = () => {
    clearTimeout(timer);
    timer = null
  }

  const onSubmitAccount = async (data: FormDataAccount) => {
    clearTimeOutTimer()
    const res = await handleSendEmailCode()
    if(res.data.code === 'SUCCESS') {
      setShowEditDialog(true)
    }
  }

  const handleSendEmailCode = () => {
    return axios.post(POST_EMAIL_CODE, {lan: i18n.language, email: getAccountValues('account'), template: 'LOGIN', site: 'biz-gateway'})
  }

  const handleSureEmailLogin = (vcode: string) => {
    auth.login({ loginType: LOGIN_TYPE_PARAM.EMAIL_VCODE, account: getAccountValues('account'), password: getAccountValues('password'), vcode, email: getAccountValues('account') }, err => {
      setErrorAccount('password', {
        type: 'manual',
        message: err ? err.message : 'email or password is invalid'
      })
    })
  }

  const callback = async (res: any) => {
    if(res.ret === 0) {
      setNeedWait(60)
      localStorage.setItem('HasSendSms', JSON.stringify(60))
      clearTimeout(timer)
      intervalSetWaitSendSms()
      auth.sendSms(
        {
          phoneNumber: getValues('phoneNumber'),
          template: 'LOGIN',
          site: 'biz-gateway'
        },
        err => {
          setErrorPhone('phoneVerifyCode', {
            type: 'manual',
            message: err ? err.message : 'sending sms failed'
          })
        }
      )
    }
  }

  const onSendSms = async () => {
    const valid = await trigger(['phoneNumber'])
    if (valid) {
      try {
        const valid = await trigger(['phoneNumber'])
        if(valid) {
          // 生成一个验证码对象
          // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
          //callback：定义的回调函数
          const {TencentCaptcha} = window as any
          if(TencentCaptcha) {
            const captcha = new TencentCaptcha('194503754', callback, {});

            // 调用方法，显示验证码
            captcha.show();
          }
        }
      }
      catch (error) {
        // 加载异常，调用验证码js加载错误处理函数
        console.log(error)
      }
    }
  }

  const errorsArray = Object.keys(errorsEmail)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length && index < 5) {
        form.elements[index + 1] && form.elements[index + 1].focus()
      }else if(index === 5) {
       handleSureEmailLogin(Array.from(form).map((v: any)=> v.value).join(''))
      }
      console.log('index', index)
      event.preventDefault()
    }
  }
  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={controlEmail}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }


  return (
    <Grid
      container
      spacing={16}
      sx={{
        display: 'flex',
        paddingTop: theme.spacing(40),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Head>
        <script src="/js/TCaptcha.js" async />
      </Head>
      {!hidden ? (
        <Grid item xl={4} lg={5} md={4}>
          <Box>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/login/${imageSource}-${theme.palette.mode}.png`}
            />
          </Box>
        </Grid>
      ) : null}

      <Box
        sx={{
          position: 'absolute',
          top: 30,
          left: '24px',
          width: 'calc(100% - 48px)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        <Box
          sx={{
            ' svg': {
              color: {
                xs: theme.palette.primary.main,
                sm: theme.palette.primary.main,
                lg: theme.palette.primary.main,
                md: theme.palette.primary.main,
                xl: theme.palette.primary.main
              }
            }
          }}
        >
          <LinkStyled
            href='/'
            sx={{
              '& svg': {
                width: 160
              }
            }}
          >
            {i18n.language.startsWith('zh_') ? <LogoWithSlogan /> : <LogoText />}
          </LinkStyled>
        </Box>

        {
          i18n.language === 'zh_CN' && <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <path
                fill='#DCDFE6'
                d='M19 11.95q0-2.925-2.038-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95h-2Zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95h-2ZM19.95 21q-3.225 0-6.288-1.438t-5.425-3.8q-2.362-2.362-3.8-5.425T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.225t.325.575l.65 3.5q.05.35-.013.638T9.4 8.45L7 10.9q1.05 1.8 2.625 3.375T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.075.575.338T21 15.9v4.05q0 .45-.3.75t-.75.3Z'
              />
            </svg>
            <TypographyStyled
              variant='body2'
              sx={{ ml: 2, fontSize: '1rem', mt: 1, color: theme.palette.secondary.light }}
            >
              {t('Login.Customer_hotline')}：400-0390-660
            </TypographyStyled>
          </Box>
        }
      </Box>

      <Grid xl={4} lg={5} md={6} sm={10} xs={11} sx={{ display: 'flex', justifyContent: 'center', pl: 16 }}>
        <Card>
          <CardContent sx={{ px: 6, py: 10 }}>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'> {t('Login.Welcome_back')} </TypographyStyled>
            </Box>

            <Box sx={{ mb: 8 }}>
              <ToggleButtonGroupStyled
                exclusive
                value={loginType}
                onChange={handleLoginTypeChange}
                aria-label='text alignment'
              >
                <ToggleButtonStyled value={LOGIN_TYPE.SMS} aria-label='left aligned'>
                  {t('Login.SMS_login')}
                </ToggleButtonStyled>
                <ToggleButtonStyled value={LOGIN_TYPE.ACCOUNT} aria-label='right aligned'>
                  {t('Login.Account_login')}
                </ToggleButtonStyled>
              </ToggleButtonGroupStyled>
            </Box>

            {loginType === LOGIN_TYPE.SMS && (
              <form noValidate autoComplete='off' onSubmit={handleSubmitPhone(onSubmitPhone)}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='phoneNumber'
                        control={controlPhone}
                        render={({ field }) => (
                          <MuiTelInputStyled
                            {...field}
                            error={Boolean(errorsPhone.phoneNumber)}
                            defaultCountry={defaultCountry || 'CN'}
                            preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                            forceCallingCode
                            placeholder={t('Login.Mobile_placeholder') || ''}
                            focusOnSelectCountry
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errorsPhone.phoneNumber && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errorsPhone.phoneNumber.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='phoneVerifyCode'
                        control={controlPhone}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Box>
                            <TextField
                              sx={{ backgroundColor: common.white, width: '100%' }}
                              label={t('Login.Verification_code')}
                              value={value || ''}
                              onChange={onChange}
                              error={Boolean(errorsPhone.phoneVerifyCode)}
                              placeholder={t('Login.Verification_code') || ''}
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
                      {errorsPhone.phoneVerifyCode && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errorsPhone.phoneVerifyCode.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Button fullWidth size='large' type={'submit'} variant='contained' sx={{ mt: 7, mb: 7 }}>
                  {t('Login.Log_in')}
                </Button>
              </form>
            )}

            {loginType === LOGIN_TYPE.ACCOUNT && (
              <form noValidate autoComplete='off' onSubmit={handleSubmitAccount(onSubmitAccount)}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='account'
                        control={controlAccount}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label={t('Login.Mobile_or_email')}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errorsAccount.account)}
                          />
                        )}
                      />
                      {errorsAccount.account && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errorsAccount.account.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errorsAccount.password)}>
                        {t('Login.Password')}
                      </InputLabel>
                      <Controller
                        name='password'
                        control={controlAccount}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            label={t('Login.Password')}
                            onChange={onChange}
                            id='auth-login-v2-password'
                            error={Boolean(errorsAccount.password)}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        )}
                      />
                      {errorsAccount.password && (
                        <FormHelperText sx={{ color: 'error.main' }} id=''>
                          {errorsAccount.password.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Button fullWidth size='large' type={'submit'} variant='contained' sx={{ mt: 7, mb: 7 }}>
                  {t('Login.Log_in')}
                </Button>
              </form>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2 }}>
                {t('Login.Newer')} <LinkStyled href='/auth/register/step1'>{t('Login.Sign_up')}</LinkStyled>
              </Typography>
              <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}> | </Divider>
              <Typography variant='body2'>
                <LinkStyled2 href='/auth/forgot-password/step1'>{t('Login.Forgot_Password')}</LinkStyled2>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={showEditDialog}
        onClose={() => {setShowEditDialog(false)}}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 450 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: { xs: '100%', md: 450 },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
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
            <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
              输入邮箱验证码
            </Typography>
            <IconButton
              size='small' onClick={() => {setShowEditDialog(false)}} sx={{color: '#7C4DFF'}}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
          <Grid item>
            <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A3541DE', lineHeight: '180%'}}>
              {t('为了保障账号安全，需要进行二次验证')}
            </Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', lineHeight: '180%'}}>
              {t(`已向您 ${getAccountValues('account')}的邮箱中发送验证码，请查收邮件并在下方输入6位数验证码`)}
            </Typography>
          </Grid>
          <form onSubmit={handleSubmitEmailCode(() => true)}>
            <CleaveWrapper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...(errorsArray.length && {
                  '& .invalid:focus': {
                    borderColor: theme => `${theme.palette.error.main} !important`,
                    boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                  }
                })
              }}
            >
              {renderInputs()}
            </CleaveWrapper>
            {errorsArray.length ? (
              <FormHelperText sx={{ color: 'error.main' }}>Please enter a valid OTP</FormHelperText>
            ) : null}
          </form>
          <Grid item sx={{fontSize: 16, fontWeight: 400, color: '#3A3541DE', lineHeight: '180%', display: 'flex',justifyContent: 'center'}}>
            没有收到电子邮件?
            <Typography sx={{fontSize: 16, fontWeight: 400, color: '#7C4DFF', lineHeight: '180%', cursor: 'pointer',ml: 3}} onClick={() => {handleSendEmailCode()}}>
              重新发送
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
