// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Components Imports
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import Button from '@mui/material/Button'

const Tips = () => {
  const { t } = useTranslation()

  return (
    <Hidden smDown>
      <Stack
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
        sx={{
          height: 48,
          color: '#fff',
          fontWeight: 500,
          background: 'url(/images/home/tips-bg.jpg) no-repeat center center',
          backgroundSize: 'cover',
          overflow: 'hidden'
        }}
      >
        <Box component='img' src='/images/home/globe.png' sx={{ width: 100, mr: 5 }} />
        <Box>{t('Make global recruitment easier!')}</Box>
        <Box sx={{ px: 5 }}>{t('Explore free tools')}</Box>
        <Button href='#' sx={{ height: 34, color: '#fff', background: '#6753d7', borderRadius: 17 }}>
          {t('Go')}
        </Button>
      </Stack>
    </Hidden>
  )
}

export default Tips
