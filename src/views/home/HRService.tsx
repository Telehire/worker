// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'
import Paragraph from './components/Paragraph'
import Button from '@mui/material/Button'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export interface HRServiceProps {
  onRequestDemo: (value: boolean) => void
}

const HRService = (hrServiceProps: HRServiceProps) => {
  const { onRequestDemo } = hrServiceProps
  const { t } = useTranslation()

  return (
    <Section style={{ background: '#f9f8ff' }}>
      <Grid container>
        <Grid item xs={12} sm={7} sx={{ width: 680, pt: { xs: 4, md: 20 } }}>
          <Typography
            color='primary.main'
            sx={theme => ({
              [theme.breakpoints.up('sm')]: { fontSize: 20, fontWeight: 400, mb: 2 },
              [theme.breakpoints.down('sm')]: { fontSize: 16, fontWeight: 400 }
            })}
          >
            {t('Talent services')}
          </Typography>

          <Title>{t('Globalization HR Globalization Compliance')}</Title>

          <Paragraph sx={{ sm: { mt: 3 }, xs: { fontSize: 11, fontWeight: 400, lineHeight: '180%', mb: 0 } }}>
            {t(
              'Log in to the account of TeleHires specially hired enterprise to create contracts and induction files for employees. We will ensure that your employees are qualified. Daily management processes, including social security, leave, attendance, reimbursement, incentive, stock options, contract renewal and resignation, are all completed online to avoid manual registration and bring a faster and safer online experience for your HR team.'
            )}
          </Paragraph>

          {/*<Hidden smDown>*/}
          {/*  <Button*/}
          {/*    href='/'*/}
          {/*    component={Link}*/}
          {/*    variant='outlined'*/}
          {/*    onClick={onRequestDemo}*/}
          {/*    endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}*/}
          {/*    sx={theme => ({*/}
          {/*      borderRadius: 4,*/}
          {/*      backgroundColor: '#f1f0ff',*/}
          {/*      borderColor: 'transparent',*/}
          {/*      my: 6*/}
          {/*    })}*/}
          {/*  >*/}
          {/*    {t('Request A Demo')}*/}
          {/*  </Button>*/}
          {/*</Hidden>*/}
        </Grid>

        <Grid item xs={12} sm={5} display='flex' justifyContent='center'>
          <Box
            component='img'
            src='/images/home/employee-map.png'
            sx={theme => ({
              width: 446,
              [theme.breakpoints.down('sm')]: { width: 260, mt: 6, mb: 9 }
            })}
          />
        </Grid>
      </Grid>
    </Section>
  )
}

export default HRService
