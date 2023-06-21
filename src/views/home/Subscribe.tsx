// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'
import Paragraph from './components/Paragraph'
import Button from './components/Button'
import { Icon } from '@iconify/react'

export interface SubscribeProps {
  onRequestDemo: (value: boolean) => void
}

const Subscribe = (subscribeProps: SubscribeProps) => {
  const { t } = useTranslation()

  return (
    <Section sx={{ background: '#f9f8ff' }}>
      <Stack flexDirection='row' justifyContent='center' alignItems='center' mt={10} mb={4}>
        <Box sx={{ md: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }}>
          <Title sx={{ xs: { fontSize: 20 } }}>{t('Join our monthly newsletter')}</Title>

          <Paragraph sx={{ sm: { mt: 3 }, xs: { mt: 2, mb: 0, lineHeight: '140%' } }}>
            {t('The latest global recruitment trends and policy changes will be sent to your mailbox')}
          </Paragraph>

          <Button
            variant='outlined'
            href='#'
            endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
            sx={theme => ({
              [theme.breakpoints.up('sm')]: { mt: 8 },
              [theme.breakpoints.down('sm')]: { mt: 4, px: 6, py: 1.5, fontSize: 12 }
            })}
          >
            {t('Subscribe now')}
          </Button>
        </Box>

        <Box
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { maxWidth: 290, ml: 40 },
            [theme.breakpoints.down('sm')]: { width: 280, mr: -2 }
          })}
        >
          <Box component='img' src='/images/home/subscribe-email.png' />
        </Box>
      </Stack>
    </Section>
  )
}

export default Subscribe
