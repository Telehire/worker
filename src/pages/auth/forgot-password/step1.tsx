// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect } from 'react'

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
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useRouter } from 'next/router'
import { common } from '@mui/material/colors'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import { Fab } from '@mui/material'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'

// ** Styled Components
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

const Img = styled('img')(({ theme }) => ({}))

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
    color: theme.palette.primary.main
  }
}))

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

interface FormDataPhone {
  phoneNumber?: string
  phoneVerifyCode?: string
}

interface FormDataEmail {
  email?: string
}

const ForgotStep1Page = () => {
  const [retrieveType, setRetrieveType] = useState<string>('email')
  const { t, i18n } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const { login } = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const imageSource = 'login-illustration'
  const { skin } = settings
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')

  const handleRetrieveTypeChange = (event: MouseEvent<HTMLElement>, newRetrieveType: string) => {
    setRetrieveType(newRetrieveType)
  }

  const {
    control: controlPhone,
    setError: setErrorPhone,
    handleSubmit: handleSubmitPhone,
    trigger,
    getValues,
    formState: { errors: errorsPhone }
  } = useForm({
    defaultValues: { phoneNumber: '', phoneVerifyCode: '' },
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

  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      setDefaultCountry(i18n.language.replace('zh_', '') as MuiTelInputCountry)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
    } else {
      setDefaultCountry(i18n.language.toUpperCase() as unknown as MuiTelInputCountry)
    }
  }, [i18n.language])

  const {
    control: controlEmail,
    setError: setErrorEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail }
  } = useForm({
    defaultValues: { email: '' },
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required()
      })
    )
  })

  const onSubmitPhone = (data: FormDataPhone) => {
    const { phoneNumber, phoneVerifyCode } = data
    auth.retrieveBySms({ template: 'RESET-PASSWORD', checkType: 'SMS', phoneNumber, phoneVerifyCode }, err => {
      setErrorPhone('phoneNumber', {
        type: 'manual',
        message: err ? err.message : 'retrieve password by sms request failed'
      })
    })
  }

  const onSubmitEmail = (data: FormDataEmail) => {
    const { email } = data
    auth.retrieveByEmail({ template: 'RESET-PASSWORD', checkType: 'EMAIL', email }, err => {
      setErrorEmail('email', {
        type: 'manual',
        message: err ? err.message : 'retrieve password by email request failed'
      })
    })
  }

  const onSendSms = async () => {
    const valid = await trigger(['phoneNumber'])
    if (valid) {
      auth.sendSms(
        {
          phoneNumber: getValues('phoneNumber'),
          template: 'RESET-PASSWORD'
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
      <Sidebar
        hidden={hidden}
        hiddenExceptLogo={true}
        hiddenSlogan={true}
        sx={{ background: `${theme.palette.info.dark}` }}
      />

      <Box
        sx={{
          position: 'absolute',
          right: '2.5rem',
          top: '1.5rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
          <path
            fill='#DCDFE6'
            d='M19 11.95q0-2.925-2.038-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95h-2Zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95h-2ZM19.95 21q-3.225 0-6.288-1.438t-5.425-3.8q-2.362-2.362-3.8-5.425T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.225t.325.575l.65 3.5q.05.35-.013.638T9.4 8.45L7 10.9q1.05 1.8 2.625 3.375T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.075.575.338T21 15.9v4.05q0 .45-.3.75t-.75.3Z'
          />
        </svg>
        <TypographyStyled variant='body2' sx={{ ml: 2, fontSize: '1rem', mt: 1, color: theme.palette.secondary.light }}>
          {t('Login.Customer_hotline')}：400-0390-660
        </TypographyStyled>
      </Box>

      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc( 100% - 360px )'
        }}
      >
        <Grid item xl={6} lg={6} md={6} sm={11} xs={11}>
          <Box
            sx={{
              height: '37px',
              [theme.breakpoints.up('sm')]: {
                width: '29rem'
              },
              position: 'relative'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: -3,
                left: 0
              }}
            >
              <LinkStyled href={'/auth/login'}>
                <Fab
                  aria-label='back'
                  sx={{ backgroundColor: common.white, width: '28px', height: '28px', minHeight: '28px' }}
                >
                  <Icon icon='material-symbols:arrow-back' />
                </Fab>
              </LinkStyled>

              <TypographyStyled
                variant='body2'
                sx={{
                  mt: 2,
                  ml: 2,
                  color: theme.palette.secondary.light,
                  [theme.breakpoints.down(380)]: { display: 'none' }
                }}
              >
                {t('Register.Back')}
              </TypographyStyled>
            </Box>
          </Box>

          <Box sx={{ py: 2 }}>
            <Card>
              <CardContent sx={{ px: 6, py: 10 }}>
                <Box sx={{ mb: 6 }}>
                  <TypographyStyled variant='h5'> {t('Register.Reset_password')} </TypographyStyled>
                </Box>

                <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center' }}>
                  <Img alt='mail' height={'130px'} src='/images/forgot/mail.png' />
                </Box>

                <Box sx={{ mb: 8 }}>
                  <ToggleButtonGroupStyled
                    exclusive
                    value={retrieveType}
                    onChange={handleRetrieveTypeChange}
                    aria-label='text alignment'
                  >
                    <ToggleButtonStyled value='email' aria-label='left aligned'>
                      {t('Register.By_email')}
                    </ToggleButtonStyled>
                    <ToggleButtonStyled value='phoneNumber' aria-label='right aligned'>
                      {t('Register.By_phone_number')}
                    </ToggleButtonStyled>
                  </ToggleButtonGroupStyled>
                </Box>

                {retrieveType === 'email' && (
                  <form noValidate autoComplete='off' onSubmit={handleSubmitEmail(onSubmitEmail)}>
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <Controller
                            name='email'
                            control={controlEmail}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                label={t('Register.Email_placeholder')}
                                value={value}
                                onChange={onChange}
                                error={Boolean(errorsEmail.email)}
                                placeholder='test@telehire.com'
                              />
                            )}
                          />
                          {errorsEmail.email && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errorsEmail.email.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button fullWidth size='large' type={'submit'} variant='contained' sx={{ mt: 7, mb: 7 }}>
                      {t('Register.Continue')}
                    </Button>
                  </form>
                )}

                {retrieveType === 'phoneNumber' && (
                  <form noValidate autoComplete='off' onSubmit={handleSubmitPhone(onSubmitPhone)}>
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <Controller
                            name='phoneNumber'
                            control={controlPhone}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <MuiTelInputStyled
                                {...field}
                                error={Boolean(errorsPhone.phoneNumber)}
                                defaultCountry={defaultCountry || 'CN'}
                                preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                                forceCallingCode
                                focusOnSelectCountry
                                placeholder={t('Register.Phone_placeholder') || ''}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          {errorsPhone.phoneNumber && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errorsPhone.phoneNumber.message}
                            </FormHelperText>
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
                                  label={t('Register.VerifyCode_placeholder')}
                                  value={value || ''}
                                  onChange={onChange}
                                  error={Boolean(errorsPhone.phoneVerifyCode)}
                                  placeholder={t('Register.VerifyCode_placeholder') || ''}
                                />

                                <Button
                                  onClick={onSendSms}
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
                                  {t('Register.Send_verification_code')}
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
                      {t('Register.Continue')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

ForgotStep1Page.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotStep1Page.guestGuard = true

export default ForgotStep1Page
