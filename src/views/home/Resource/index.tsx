// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from '../components/Section'
import Title from '../components/Title'
import Paragraph from '../components/Paragraph'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import JoinUsWrap from '../JoinUsWrap'
import Link from 'next/link'
import {beforeWrite} from "@popperjs/core";

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}

const defaultValue = [
  [
    {
      url: '/images/home/resource/Mask group (3).png',
      insideUrl: '/images/home/resource/flag1.png',
      title: 'Singapore',
      currency: 'Singapore Dollar (S$,SGD)',
      lng: 'English, Chinese and Malay Tamil'
    },
    {
      url: '/images/home/resource/Mask group (4).png',
      insideUrl: '/images/home/resource/flag9.png',
      title: 'Hong Kong',
      currency: 'Hong Kong dollar (HK$, HKD)',
      lng: 'English (official), Chinese (official), Cantonese'
    },
    {
      url: '/images/home/resource/Mask group (5).png',
      insideUrl: '/images/home/resource/flag8.png',
      title: 'Taiwan',
      currency: '新台币 (NT$, TWD)',
      lng: 'traditional Chinese'
    }
  ],
  [
    {
      url: '/images/home/resource/Mask group (6).png',
      insideUrl: '/images/home/resource/flag7.png',
      title: 'U.S.',
      currency: 'US dollar (USD)',
      lng: 'English'
    },
    {
      url: '/images/home/resource/Mask group (7).png',
      insideUrl: '/images/home/resource/flag6.png',
      title: 'Thailand',
      currency: 'Thai Baht (THB)',
      lng: 'Thai'
    },
    {
      url: '/images/home/resource/Mask group (8).png',
      insideUrl: '/images/home/resource/flag5.png',
      title: 'Japan',
      currency: 'Japanese Yen (Ұ, JPY)',
      lng: 'Japanese'
    }
  ],
  [
    {
      url: '/images/home/resource/Mask group (9).png',
      insideUrl: '/images/home/resource/flag4.png',
      title: 'United Arab Emirates',
      currency: 'Dirham (DH, Dhs)',
      lng: 'Arabic, English'
    },
    {
      url: '/images/home/resource/Mask group (10).png',
      insideUrl: '/images/home/resource/flag3.png',
      title: 'China',
      currency: 'Renminbi (¥, CNY)',
      lng: 'Simplified Chinese'
    },
    {
      url: '/images/home/resource/Mask group (11).png',
      insideUrl: '/images/home/resource/flag1.png',
      title: 'South Korea',
      currency: 'South Korean Won (₩, KRW)',
      lng: 'Korean'
    }
  ],

]

const Resource = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()

  const infoCard = (url: string, insideUrl: string, title: string, currency: string, lng: string, index: number) => {
    return (
      <Grid item xs={12} sm={3.8} sx={{flex: 1,display: 'flex',alignItems: 'center', flexDirection: 'column',border: '1px solid #3A35411F', backgroundColor: '#F9FAFC', borderRadius: 3, padding: 0, mb: 6}}>
        <Box component="img" src={url} width="100%" sx={{mb: 5.5}} />
        <Grid item xs={12} sm={12} sx={{width: '100%', pl: 6, mb: 10}}>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 6}}>
            <Box component="img" src={insideUrl} width={36} sx={{mr: 5.5}} />
            <Typography sx={{fontSize: 16, fontWeight: 500, color :'#3A3541DE'}}>{t(title)}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 3.5 }}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4}}>{`${t('currency')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE'}}>{t(currency)}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 3.5}}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4}}>{`${t('language')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE'}}>{t(lng)}</Typography>
          </Grid>
        </Grid>
        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 4.5}}>
          <Grid item sx={{display: 'flex', alignItems: 'center',flex: 1}}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE', px: 3, py: 2, backgroundColor: '#8A8D9314', borderRadius: 3, mr: 4}}>{t('EOR staff')}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE', px: 3, py: 2, backgroundColor: '#8A8D9314', borderRadius: 3}}>{t('contractor')}</Typography>
          </Grid>
          <Button
            href={`/home/resource/national-policy?country=${index}`}
            component={Link}
            variant='outlined'
            endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
            sx={{
              margin: 0,
              borderRadius: 4,
              color: '#7159F9',
              backgroundColor: '#fff',
              borderColor: '#7C4DFF',
              my: 6,
            }}
          >
            {t('Employment Guide')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={{
            backgroundColor: '#7C4DFF',
            height: 560,
          }}
        >
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          <Grid item sm={3} xs={12} sx={{px: 2}}>
            <Hidden smDown>
              <Typography sx={{fontSize: 42, fontWeight: 600, color :'#fff', mb: 4.5}}>{t('Global Employment Policy')}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography sx={{fontSize: 24, fontWeight: 600, color :'#fff', mb: 4.5}}>{t('Global Employment Policy')}</Typography>
            </Hidden>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#fff'}}>
              {t('TeleHire offers a turnkey HR solution that makes it easy to hire, pay and manage employees in over 150 countries without the need for a physical presence. Additionally, we can help you fully comply with local laws so you can focus on running your business.')}
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box
              component='img'
              src={`/images/home/resource/resource-map.png`}
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { maxWidth: 859 },
              })}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.5} />
          </Hidden>
        </Grid>
      </Grid>
      <Section sx={{ background: '#fff', pt: 25 }}>
        {
          defaultValue.map((v: any, vIndex: number) => (
            <Grid container md={12} sm={12} mb={10} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              {
                v.map((item: any, index: number) => {
                  return infoCard(item.url, item.insideUrl, item.title, item.currency, item.lng, vIndex * 3 + index)
                })
              }
            </Grid>
          ))
        }
      </Section>

      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answering all your questions about global recruitment')}
      />
    </>
  )
}

export default Resource
