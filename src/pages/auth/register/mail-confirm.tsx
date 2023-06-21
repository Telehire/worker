// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect, Fragment } from 'react'

import LogoText from 'src/components/svg/LogoText'
import BlankLayout from '../../../@core/layouts/BlankLayout'
import RegisterMailSendPage from './mail-send'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Button from '../../../views/home/components/Button'
import Link from 'next/link'
import { common } from '@mui/material/colors'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' },
  margin: '20rem auto'
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
  width: '100%'
}))

const RegisterMailConfirmPage = () => {
  const theme = useTheme()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 20 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <LogoText />
          <Box sx={{ my: 10 }}>
            <TypographyStyled variant='h5'> 欢迎来到 TeleHire 特聘 </TypographyStyled>
          </Box>
        </Box>

        <Box
          sx={{
            padding: '0 10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <TypographyStyled variant='body2'> 你好，XXX </TypographyStyled>
          <TypographyStyled variant='body2'> 请确认您的电子邮件地址以继续使用Remote创建您的帐户！ </TypographyStyled>
          <LinkStyled href={'/'} sx={{ pb: 10 }}>
            <Button
              fullWidth
              size='large'
              type='button'
              variant='contained'
              sx={{ borderRadius: '5px', backgroundColor: theme.palette.primary.dark, color: common.white }}
            >
              确认我的电子邮件地址
            </Button>
          </LinkStyled>
          <TypographyStyled variant='body2'> 诚挚的问候 </TypographyStyled>
          <TypographyStyled variant='body2'> TeleHire 特聘 </TypographyStyled>
        </Box>
      </CardContent>
    </Card>
  )
}

RegisterMailConfirmPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterMailConfirmPage.guestGuard = true

export default RegisterMailConfirmPage
