// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#ECF5FF'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#3296FA'
  }
}))

const data = [
  {
    id: 1,
    country: 'Andorra',
    progress: 35,
    flag: '/images/dashboards/flag1.png'
  },
  {
    id: 2,
    country: 'United Arab Emirates',
    progress: 20,
    flag: '/images/dashboards/flag2.png'
  },
  {
    id: 3,
    country: 'United Arab Emirates',
    progress: 15,
    flag: '/images/dashboards/flag3.png'
  },
  {
    id: 4,
    country: 'Anguilla',
    progress: 10,
    flag: '/images/dashboards/flag4.png'
  },
  {
    id: 5,
    country: 'Armenia',
    progress: 5,
    flag: '/images/dashboards/flag5.png'
  }
]

const GlobalTeams = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('全球团队')}（22）</Typography>
        </Stack>

        <Stack spacing={6} minHeight={{ md: 280, sm: 'auto' }}>
          {data.map(item => (
            <Stack direction='row' alignItems='center' key={item.id}>
              <Box component='img' src={item.flag} sx={{ width: 40, height: 20, mr: 2 }} />

              <Link
                display='block'
                href='#'
                sx={{
                  flex: 0,
                  minWidth: '20%',
                  mr: 2,
                  fontSize: 14,
                  lineHeight: '38px',
                  color: '#303133',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.country}
              </Link>

              <Box sx={{ flex: 1 }}>
                <BorderLinearProgress variant='determinate' value={item.progress} />
              </Box>

              <Typography
                variant='body2'
                sx={{ flex: 0, minWidth: 40, fontWeight: 500, textAlign: 'right', color: '#000000' }}
              >
                {item.progress}%
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default GlobalTeams
