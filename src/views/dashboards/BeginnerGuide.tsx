// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Components Imports
import Link from 'src/components/link'

const data = [
  {
    id: 1,
    title: '完善您的公司信息，开启全球招聘',
    url: '#'
  },
  {
    id: 2,
    title: '第一次使用系统，该选择哪种方式的员工',
    url: '#'
  },
  {
    id: 3,
    title: '如何进行账单支付？',
    url: '#'
  }
]

const BeginnerGuide = () => {
  const { t } = useTranslation()

  return (
    <Card sx={{ height: 147 }}>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 6.5 }}>{t('补充公司认证信息')}</Typography>
        <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Button variant='outlined' size='small' component={Link} href='/enterprise/certification/'>
            去补充
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('新手引导')}</Typography>
          <Link href='#' sx={{ fontSize: 14, fontWeight: 400, color: 'info.main' }}>
            {t('更多 >')}
          </Link>
        </Stack>

        <Box>
          {data.map(item => (
            <Link
              href={item.url}
              key={item.id}
              sx={{ display: 'block', fontSize: 14, lineHeight: '21px', color: '#303133' }}
            >
              <Stack direction='row' alignItems='center'>
                <Box
                  component='span'
                  sx={{
                    display: 'inline-block',
                    width: 4,
                    height: 4,
                    mr: 2,
                    borderRadius: '50%',
                    background: '#303133'
                  }}
                />
                <Box
                  component='span'
                  sx={{
                    mr: 2,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.title}
                </Box>
                <Box>→</Box>
              </Stack>
            </Link>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default BeginnerGuide
