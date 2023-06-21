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
import { Fab, FormControlLabel, SxProps, Theme } from '@mui/material'
import Hidden from '@mui/material/Hidden'

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

export interface Props {
  sx?: SxProps<Theme> & { background?: string; sm?: SxProps<Theme>; xs?: SxProps<Theme> }
}

const RedirectLogin = (props: Props) => {
  const { sx } = props || {}
  const { t } = useTranslation()
  const theme = useTheme()

  return (

    // @ts-ignore
    <Box {...sx}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Hidden smDown>
          <TypographyStyled
            variant='body2'
            sx={{ ml: 2, fontSize: '1rem', mt: 1, color: theme.palette.secondary.light }}
          >
            {t('Register.Already_have_account')}
          </TypographyStyled>
        </Hidden>
        <LinkStyled href='/auth/login'>
          <Button variant='outlined' sx={{ borderRadius: '16px' }} size='small'>
            {t('Register.Log_in')}
          </Button>
        </LinkStyled>
      </Box>
    </Box>
  )
}

RedirectLogin.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RedirectLogin
