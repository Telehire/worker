// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const data = [
  {
    id: 1,
    title: '平台介绍视频',
    subTitle: '了解我们平台的概况以及您需要了解的主要功能的细分。',
    icon: '/images/dashboards/resource-video.png',
    url: '#'
  },
  {
    id: 2,
    title: '查看全球招聘工具包',
    subTitle: '了解 80 多个国家/地区的招聘情况，并更新当地法律和市场费率。',
    icon: '/images/dashboards/resource-video.png',
    url: '#'
  }
]

const Resources = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('资源')}</Typography>
          <Link href='#' sx={{ fontSize: 14, fontWeight: 400, color: 'info.main' }}>
            {t('更多 >')}
          </Link>
        </Stack>

        <Stack spacing={4} sx={{ minHeight: 284 }}>
          {data.map(item => (
            <Link display='block' href={item.url} key={item.id} sx={{ p: 5, background: '#F2F5FB', borderRadius: 2 }}>
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Stack direction='row' alignItems='center'>
                  <Box component='img' src={item.icon} sx={{ width: 48, height: 48 }} />
                  <Box sx={{ ml: 4, mr: 10 }}>
                    <Typography variant='subtitle1' fontWeight='bold' color='text.main'>
                      {item.title}
                    </Typography>
                    <Typography variant='subtitle2'>{item.subTitle}</Typography>
                  </Box>
                </Stack>
                <Box>→</Box>
              </Stack>
            </Link>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Resources
