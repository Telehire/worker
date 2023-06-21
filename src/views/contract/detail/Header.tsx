// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
import axios from 'axios'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileHeaderType } from 'src/@fake-db/types'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: '50%',
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<ProfileHeaderType | null>(null)
  const theme = useTheme()
  useEffect(() => {
    axios.get('/pages/profile-header').then(response => {
      setData(response.data)
    })
  }, [])

  const designationIcon = data?.designationIcon || 'mdi:briefcase-outline'

  const InfoSpan = (props: { title: string, value: string }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        mr: 9
      }} 
    >
      <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}>
        {props.title}：
      </Typography>
      <Typography sx={{ fontSize: '12px', color: theme.palette.text.primary, ml: 1, whiteSpace: 'nowrap' }}>
        {props.value}
      </Typography>
    </Box>
  )

  return data !== null ? (
    <Card>
      <CardMedia
        sx={{
          height: { xs: 48, md: 66 },
          background: 'gray'
        }}
      ></CardMedia>
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: ['flex-end'],
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >

          <ProfilePicture src={data.profileImg} alt='profile-picture' />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              ml: { xs: 0, md: 6 },
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }}>
              <Typography variant='h5' sx={{ mb: 1, fontWeight: 500 }}>
                王学兵
              </Typography>
              <CustomChip rounded label={t('等待报价')} skin='light' color='info' sx={{ ml: 2, height: 32 }} />
              
            </Box>
        </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['flex-start', 'justify-between'],
            mt: 4
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: 'flex-start',
            }}
          >
            <InfoSpan title={t('职称')} value={t('前端工程师')}/>
            <InfoSpan title={t('合同类型')} value={t('全职员工')}/>
            <InfoSpan title={t('Team')} value={t('台湾数银Shiming’ Team')}/>
            <InfoSpan title={t('创建时间')} value={t('2023/02/28 12:00')}/>
            <InfoSpan title={t('创建人')} value={t('吴彦翰')}/>
          </Box>
          <Box
            sx={{
              py: 1.75,
              px: 5.5,
              color: '#7C4DFF',
              border: '1px solid #7C4DFF',
              borderRadius: '5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
          >
            {t('修改合同')}
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default UserProfileHeader
