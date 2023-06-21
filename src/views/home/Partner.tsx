// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'

const data = [
  {
    title: ''
  },
  {
    title: ''
  },
  {
    title: ''
  },
  {
    title: ''
  },
  {
    title: ''
  },
  {
    title: ''
  }
]

export interface PartnerProps {
  onRequestDemo: (value: boolean) => void
}

const Partner = (partnerProps: PartnerProps) => {
  const { t } = useTranslation()

  return (
    <Section>
      <Title sx={{ textAlign: 'center', sm: { mt: 25, mb: 8 }, xs: { mt: 15, mb: 5 } }}>
        {t('Trusted by the worlds leading companies')}
      </Title>

      <Grid container mb={16} spacing={{ sm: 4, xs: 2.5 }}>
        {data.map((item, index) => (
          <Hidden smUp={index > 3}>
            <Grid item sm={3} xs={4}>
              <Box py={5} sx={{ background: '#F6F5FF', borderRadius: 2 }}>
                <Typography variant='h4' color='#EAE9F7' textAlign='center'>
                  LOGO
                </Typography>
              </Box>
            </Grid>
          </Hidden>
        ))}
      </Grid>
    </Section>
  )
}

export default Partner
