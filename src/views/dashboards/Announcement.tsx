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
    title: '为 2022 年报税季做好准备，快速实现',
    createdAt: '2022-12-16',
    url: '#'
  },
  {
    id: 2,
    title: '为 2022 年报税季做好准备，快速实现',
    createdAt: '2022-12-09',
    url: '#'
  },
  {
    id: 3,
    title: '更新法规和法律文件',
    createdAt: '2022-12-09',
    url: '#'
  },
  {
    id: 4,
    title: '更新法规和法律文件',
    createdAt: '2022-12-09',
    url: '#'
  },
  {
    id: 5,
    title: '为 2022 年报税季做好准备',
    createdAt: '2022-12-09',
    url: '#'
  }
]

const Announcement = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('公告')}</Typography>
          <Link href='#' sx={{ fontSize: 14, fontWeight: 400, color: 'info.main' }}>
            {t('更多 >')}
          </Link>
        </Stack>

        <Box sx={theme => ({ [theme.breakpoints.up('sm')]: { minHeight: 205 } })}>
          {data.map(item => (
            <Link
              display='block'
              href={item.url}
              key={item.id}
              sx={{ fontSize: 14, lineHeight: '38px', color: '#303133' }}
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
                  {item.createdAt?.slice(5)} {item.title}
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

export default Announcement
