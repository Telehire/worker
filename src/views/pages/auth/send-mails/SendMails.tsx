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
import { useRouter } from 'next/router'
import { common } from '@mui/material/colors'
import { RegisterParams } from '../../../../context/types'
import { Fab, FormControlLabel } from '@mui/material'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import RedirectLogin from '../redirect-login/RedirectLogin'
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

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}))

const defaultValues = {
  password: '',
  passwordAgain: ''
}

const schema = yup.object().shape({
  password: yup.string().min(8).required(),
  passwordAgain: yup.string().min(8).required()
})

interface IProsp{
  isRegister?: boolean
  handleBack?: any
  reSend?: any
  currentEmail?: string
}

const SendMails = (props: IProsp) => {
  const {isRegister, handleBack, reSend, currentEmail} = props
  const { t } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const { login } = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { skin } = settings

  const {
    control: control,
    setError: setError,
    handleSubmit: handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleOnBack = () => {
    if(handleBack) {
      handleBack()
    }
  }

  const handleReSend = () => {
    if(reSend) {
      reSend()
    }
  }



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
        }
      }}
    >
      {
        !isRegister && <Sidebar hidden={hidden} hiddenExceptLogo={true} />
      }
      <RedirectLogin sx={{ position: 'absolute', right: '2.5rem', top: '1.5rem' }} />

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
                width: '30rem'
              }
            }}
          >
            <Box
              sx={{
                mb: 6,
                height: 30
              }}
            >
              <Box sx={{ mt: 20, position: 'relative' }}>
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
                  <LinkStyled href={isRegister ? 'javascript:void(0);' : '/auth/forgot-password/step1'} onClick={handleOnBack}>
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
            </Box>

            <Box sx={{ mb: 6, minHeight: 30 }}>
              <Typography variant='subtitle1' sx={{ mb: 2 }}>
                {`${t('Register.Email_send_tip1')}${currentEmail}${t('Register.Email_send_tip2')}`}
              </Typography>
            </Box>

            <Card>
              <CardContent>
                <Box>
                  <Typography variant='subtitle1' sx={{ mb: 2 }}>
                    {t('Register.Not_receive_email')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ mb: 4 }}>
                    {t('Register.Email_send_again_tip')}
                  </Typography>
                </Box>
                <Button variant='outlined' onClick={() => {handleReSend()}}>{t('Register.Resend_email')}</Button>
              </CardContent>
            </Card>
          </Box>

          {
            !isRegister && (
              <Box sx={{ marginTop: '20%', marginLeft: '50%' }}>
                <Img alt='mail' height={'278px'} src='/images/register/mail.png' />
              </Box>
            )
          }
        </Grid>
      </Grid>
    </Box>
  )
}

SendMails.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default SendMails
