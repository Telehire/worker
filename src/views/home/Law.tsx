// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'

export interface LawProps {
  onRequestDemo: (value: boolean) => void
}

const Law = (lawProps: LawProps) => {
  const { t } = useTranslation()

  const data = [
    {
      title: t('Take responsibility for laws and regulations'),
      subTitle: t(
        'When you hire employees at TeleHire, we will assume all employment responsibilities and comply with local laws.'
      )
    },
    {
      title: t('Comply with EU data protection regulations'),
      subTitle: t(
        'We comply with GDPR EU privacy protection policy to ensure the data privacy of customers, employees and enterprises'
      )
    },
    {
      title: t('Don not worry about intellectual property'),
      subTitle: t('Maintain full control and retention of the team is intellectual property and invention rights.')
    },
    {
      title: t('Serve you 24 hours a day'),
      subTitle: t('Our support team is online 24 hours a day. Any problems? We will answer you in time')
    }
  ]

  return (
    <Section>
      <Title sx={{ textAlign: 'center', sm: { mt: 25, mb: 18 }, xs: { mt: 15, mb: 5 } }}>
        {t('Reliable. Secure. Compliant.')}
      </Title>

      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid item sm={3} xs={12}>
            <Stack
              alignItems='center'
              sx={theme => ({
                [theme.breakpoints.down('sm')]: { flexDirection: 'row' }
              })}
            >
              <Box
                component='img'
                src={`/images/home/law${index + 1}.png`}
                sx={theme => ({
                  [theme.breakpoints.up('sm')]: { width: 100 },
                  [theme.breakpoints.down('sm')]: { width: 50, mr: 4 }
                })}
              />

              <Box>
                <Typography
                  color='primary.main'
                  sx={theme => ({
                    fontWeight: 500,
                    lineHeight: '140%',
                    [theme.breakpoints.up('sm')]: { fontSize: 18, textAlign: 'center', mt: 6, mb: 3 },
                    [theme.breakpoints.down('sm')]: { fontSize: 14, mb: 1.5 }
                  })}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={theme => ({
                    lineHeight: '180%',
                    [theme.breakpoints.up('sm')]: { textAlign: 'center' },
                    [theme.breakpoints.down('sm')]: { fontSize: 11 }
                  })}
                >
                  {item.subTitle}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}

export default Law
