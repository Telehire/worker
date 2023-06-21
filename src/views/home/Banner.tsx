// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Components Imports
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'

import { Icon } from '@iconify/react'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

export interface BannerProps {
  onRequestDemo: (value: boolean) => void
}

const Banner = (bannerProps: BannerProps) => {
  const { onRequestDemo } = bannerProps
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  return (
    <Section
      style={{
        background: theme.palette.primary.main
      }}
      sx={{ sm: { marginTop: '-72px' }, xs: { marginTop: '0' } }}
    >
      <Box
        sx={theme => ({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.up('md')]: { height: 730 },
          [theme.breakpoints.down('md')]: {
            height: i18n.language === 'en' || i18n.language === 'jp' ? '130vw' : '110vw',
            mt: 15
          }
        })}
      >
        <Box
          sx={theme => ({
            [theme.breakpoints.up('md')]: { width: '40%' },
            [theme.breakpoints.down('md')]: { width: '100%' }
          })}
        >
          <Typography
            sx={theme => ({
              color: '#fff',
              fontWeight: 700,
              lineHeight: '120%',
              [theme.breakpoints.up('md')]: { fontSize: i18n.language === 'en' ? 50 : 64 },
              [theme.breakpoints.down('md')]: { fontSize: 36 },
              [theme.breakpoints.down('sm')]: { fontSize: 26 }
            })}
          >
            {i18n.language === 'en' ? t('Banner Global') : null}
            {i18n.language === 'en' ? <br /> : null}
            {t('HR Solutions for')}
            <Hidden smUp>{i18n.language !== 'en' ? '，' : null}</Hidden>
            <Hidden smDown>
              <br />
            </Hidden>
            {t('Distributed Teams')}
          </Typography>

          <Typography
            sx={theme => ({
              color: '#fff',
              lineHeight: '160%',
              ontSize: 16,
              fontWeight: 400,
              mt: 6,
              mb: 8,
              width: '100%'
            })}
          >
            {t(
              'We will handle your worldwide compliance, payroll, and HR in 150+ countries, so you can fast-track global expansion.'
            )}
          </Typography>

          <Button
            variant='outlined'
            component={Link}
            href='#'
            onClick={onRequestDemo}
            endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
            sx={{
              whiteSpace: 'nowrap',
              fontSize: 13,
              fontWeight: 400,
              lineHeight: '160%',
              color: '#040404',
              background: '#ffc736',
              borderRadius: 24,
              boxShadow: 'none'
            }}
          >
            {t('Request A Demo')}
          </Button>
        </Box>
        <Box
          component='img'
          src='/images/home/banner-bg.png'
          sx={theme => ({
            [theme.breakpoints.up('md')]: { width: '55%' },
            [theme.breakpoints.down('md')]: { width: '100%' }
          })}
        ></Box>
      </Box>
    </Section>
  )
}

export default Banner
