// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect, Fragment } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import YupPassword from 'yup-password'

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
import { RegisterParams, ResetProps } from '../../../../context/types'
import { Fab, FormControlLabel } from '@mui/material'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import i18n from 'i18next'

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

YupPassword(yup)

const defaultValues = {
  password: '',
  passwordAgain: ''
}

const schema = yup.object().shape({
  password: yup.string().min(8).minNumbers(1).minLowercase(1).minUppercase(1).required(),
  passwordAgain: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match!")
    .required()
})

const schemaLength = yup.string().min(8)
const schemaNumber = yup.string().minNumbers(1)
const schemaLowercase = yup.string().minLowercase(1)
const schemaUppercase = yup.string().minUppercase(1)

const ResetView = (props: ResetProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordAgain, setShowPasswordAgain] = useState<boolean>(false)

  const [hasLength, setHasLength] = useState<boolean>(false)
  const [hasNumber, setHasNumber] = useState<boolean>(false)
  const [hasLowercase, setHasLowercase] = useState<boolean>(false)
  const [hasUppercase, setHasUppercase] = useState<boolean>(false)

  const { t } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const { login } = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const [emailId, setEmailId] = useState<string>('')
  const [vcode, setVcode] = useState<string>('')
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { skin } = settings

  const {
    control: control,
    setError: setError,
    handleSubmit: handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: RegisterParams) => {
    const { password } = data
    if (emailId) {
      const params = {
        password,
        emailId,
        vcode,
      }
      auth.registerByEmailFinal(params, err => {
        setError('passwordAgain', {
          type: 'manual',
          message: err ? err.message : 'init password failed'
        })
      })
    } else {
      auth.setPwd({ password }, err => {
        setError('passwordAgain', {
          type: 'manual',
          message: err ? err.message : 'init password failed'
        })
      })
    }
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'password') {
        setHasLength(schemaLength.isValidSync(value.password))
        setHasNumber(schemaNumber.isValidSync(value.password))
        setHasLowercase(schemaLowercase.isValidSync(value.password))
        setHasUppercase(schemaUppercase.isValidSync(value.password))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if(router.query.vode) {
      setEmailId(String(router.query.logId))
      setVcode(String(router.query.vode))
    }
  }, [router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
        hiddenSlogan={props.source === 'forgot'}
        sx={{ background: props.source === 'forgot' ? `${theme.palette.info.dark}` : `${theme.palette.primary.main}` }}
      />

      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            width: 'calc( 100% - 360px )'
          },
          [theme.breakpoints.down('sm')]: {
            width: 'calc( 100% - 60px )'
          }
        }}
      >
        <Grid item xl={6} lg={6} md={6} sm={11} xs={11}>
          <Box
            sx={{
              px: 6,
              py: 10,
              [theme.breakpoints.up('sm')]: {
                width: '29rem'
              }
            }}
          >
            <Box sx={{ mb: 6, mt: 20, position: 'relative' }}>
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
                <LinkStyled href={'/auth/register/step1'}>
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
              <TypographyStyled variant='h5'>{props.title}</TypographyStyled>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-register-step2-password' error={Boolean(errors.password)}>
                      {t('Register.Enter_password')}
                    </InputLabel>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          sx={{ backgroundColor: common.white }}
                          label={t('Register.Enter_password')}
                          onChange={onChange}
                          id='auth-register-step2-password'
                          error={Boolean(errors.password)}
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
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Grid container>
                    <Grid item sm={6} xs={12}>
                      <Box
                        component='span'
                        sx={{
                          mr: 3,
                          color: hasLength ? theme.palette.success.main : theme.palette.secondary.light
                        }}
                      >
                        <Icon icon='mdi:circle' fontSize='0.625rem' />
                      </Box>
                      <span>{t('Register.Length_valid')}</span>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Box
                        component='span'
                        sx={{ mr: 3, color: hasNumber ? theme.palette.success.main : theme.palette.secondary.light }}
                      >
                        <Icon icon='mdi:circle' fontSize='0.625rem' />
                      </Box>
                      <span>{t('Register.Number')}</span>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Box
                        component='span'
                        sx={{ mr: 3, color: hasLowercase ? theme.palette.success.main : theme.palette.secondary.light }}
                      >
                        <Icon icon='mdi:circle' fontSize='0.625rem' />
                      </Box>
                      <span>{t('Register.Lowercase_characters')}</span>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Box
                        component='span'
                        sx={{ mr: 3, color: hasUppercase ? theme.palette.success.main : theme.palette.secondary.light }}
                      >
                        <Icon icon='mdi:circle' fontSize='0.625rem' />
                      </Box>
                      <span>{t('Register.Uppercase_characters')}</span>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-register-step2-password-2' error={Boolean(errors.passwordAgain)}>
                      {t('Register.Enter_password_again')}
                    </InputLabel>
                    <Controller
                      name='passwordAgain'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          sx={{ backgroundColor: common.white }}
                          label={t('Register.Enter_password_again')}
                          onChange={onChange}
                          id='auth-register-step2-password-2'
                          error={Boolean(errors.passwordAgain)}
                          type={showPasswordAgain ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                              >
                                <Icon
                                  icon={showPasswordAgain ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                  fontSize={20}
                                />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.passwordAgain && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.passwordAgain.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mt: 7, mb: 7 }}>
                {t('Register.Yes')}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ResetView
