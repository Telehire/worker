// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Button from '@mui/material/Button'
import Link from 'next/link'

export interface FooterBannerProps {
  onRequestDemo: (value: boolean) => void
}

const FooterBanner = (footerBannerProps: FooterBannerProps) => {
  const { t, i18n } = useTranslation()
  const { onRequestDemo } = footerBannerProps

  return (
    <Section
      sx={{
        sm: {
          height: 500,
          background: 'url(/images/home/footer-banner-bg1.jpg) no-repeat center center',
          backgroundSize: 'cover'
        },
        xs: {
          height: '90vw',
          background: 'url(/images/home/footer-banner-bg2.jpg) no-repeat center center',
          backgroundSize: 'cover'
        }
      }}
    >
      <Stack justifyContent='center' alignItems='center' mt={{ sm: 12, xs: 6 }}>
        <Typography
          sx={theme => ({
            color: '#fff',
            textAlign: 'center',
            fontWeight: 600,
            lineHeight: '140%',
            [theme.breakpoints.up('sm')]: { fontSize: 32 },
            [theme.breakpoints.down('sm')]: { fontSize: 22 }
          })}
        >
          {t('Start overseas recruitment')}
        </Typography>

        <Typography
          sx={theme => ({
            color: '#fff',
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: { fontSize: 14, fontWeight: 300, lineHeight: '140%', mt: 2 },
            [theme.breakpoints.down('sm')]: { fontSize: 11, fontWeight: 300, lineHeight: '160%', mt: 2 }
          })}
        >
          {t(
            'Footer We will handle your worldwide compliance, payroll, and HR in 150+ countries, so you can fast-track global expansion.'
          )}
        </Typography>

        <Button
          href='/'
          component={Link}
          variant='contained'
          onClick={onRequestDemo}
          sx={theme => ({
            borderRadius: 4,
            color: '#040404',
            background: '#FFC736',
            [theme.breakpoints.up('sm')]: { my: 6, px: 9.5, py: 1, fontSize: 20 },
            [theme.breakpoints.down('sm')]: { my: 6, px: 7, py: 1, fontSize: 15 }
          })}
        >
          {t('Free Experience')}
        </Button>
        {
          i18n.language === 'zh_CN' && <Stack
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
            sx={{ display: 'flex' }}
          >
            <Typography
              sx={theme => ({
                color: '#fff',
                fontWeight: 500,
                lineHeight: '140%',
                [theme.breakpoints.up('sm')]: { fontSize: 16 },
                [theme.breakpoints.down('sm')]: { fontSize: 12 }
              })}
            >
              {t('Product Inquiry')}
            </Typography>
            <Box
              component='img'
              src='/images/home/phone.png'
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { width: 18, height: 18, mx: 1 },
                [theme.breakpoints.down('sm')]: { width: 14, height: 14, mx: 1 }
              })}
            />
            <Typography
              sx={theme => ({
                color: '#fff',
                fontWeight: 500,
                lineHeight: '140%',
                [theme.breakpoints.up('sm')]: { fontSize: 16 },
                [theme.breakpoints.down('sm')]: { fontSize: 12 }
              })}
            >
              400-0390-660
            </Typography>
          </Stack>
        }

      </Stack>
    </Section>
  )
}

export default FooterBanner
