// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  title: string
  backUrl?: string
}

const Header = ({ title, backUrl }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onBack = () => {
    if (backUrl) {
      router.replace(backUrl)
    }
  }

  return (
    <Stack direction='row' alignItems='center' sx={{ mb: 5 }}>
      {backUrl ? (
        <Stack direction='row' alignItems='center' onClick={onBack} sx={{ cursor: 'pointer' }}>
          <Box
            component='img'
            src='/images/organization/back.png'
            sx={{ width: 28, height: 28, borderRadius: '50%', background: '#fff' }}
          />
          <Typography variant='body2' sx={{ ml: 2, mr: 6 }}>
            {t('返回')}
          </Typography>
        </Stack>
      ) : null}

      <Typography variant='h6'>{title}</Typography>
    </Stack>
  )
}

export default Header
