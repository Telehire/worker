// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect, Fragment } from 'react'

import LogoText from 'src/components/svg/LogoText'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Button from 'src/views/home/components/Button'
import Link from 'next/link'
import { common } from '@mui/material/colors'
import LogoWithSlogan from '../../../components/svg/LogoWithSlogan'
import LogoWithI18n from '../../../views/components/logo/LogoWithI18n'
import { useTranslation } from 'react-i18next'

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

const RequestDemoMail = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()

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
          <LogoWithI18n color={theme.palette.primary.main} />
          <Box sx={{ my: 10 }}>
            <TypographyStyled variant='h5'> {t('Request demo mail welcome')} </TypographyStyled>
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
          <TypographyStyled variant='body1'> {t('Request demo mail hello')} xxx </TypographyStyled>
          <TypographyStyled variant='body1' sx={{ mb: 10, fontSize: '0.875rem', textAlign: 'left' }}>
            {t('Request demo mail thanks')}
          </TypographyStyled>

          <TypographyStyled variant='body2'> {t('Request demo mail greeting')} </TypographyStyled>
          <TypographyStyled variant='body2'> {t('Request demo mail sender')} </TypographyStyled>

          <LinkStyled href={'/'} sx={{ pb: 10 }}>
            <Button
              fullWidth
              size='large'
              type='button'
              variant='contained'
              sx={{ borderRadius: '5px', backgroundColor: theme.palette.primary.main, color: common.white }}
            >
              {t('Request demo mail guide')}
            </Button>
          </LinkStyled>
        </Box>
      </CardContent>
    </Card>
  )
}

RequestDemoMail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RequestDemoMail.guestGuard = true

export default RequestDemoMail
