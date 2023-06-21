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
import AutoTitle from "../../components/auto-title";
import Link from 'next/link'
import {beforeWrite} from "@popperjs/core";

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}

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

const CasePreview = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()

  const textContent = (index: string, title: string, desc: string, btnText: string, btnText2?: string, desc2?: string, width?: number, ) => {
    return <Grid item sm={width || 5.5} xs={12}>
      <Typography sx={{fontSize: 24, fontWeight: 700, color :'#3A354199', mb: 2}}>{index}</Typography>
      <AutoTitle title={title} sx={{mb: 6, textAlign: 'left'}} />
      <Grid sx={{display: 'flex', alignItems: 'center'}}>
        <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', backgroundColor: '#9155FD14', py: 1, px: 7, borderRadius: 19,textAlign: 'center', mb: 5}}>{btnText}</Typography>
        <Grid sx={{flex: 1}} />
      </Grid>
      <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%'}}>
        {t(desc)}
      </Typography>
      {btnText2 &&
        <Grid sx={{display: 'flex', alignItems: 'center'}}>
          <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', backgroundColor: '#9155FD14', py: 1, px: 7, borderRadius: 19,textAlign: 'center', mb: 5, mt: 14}}>{btnText2}</Typography>
          <Grid sx={{flex: 1}} />
        </Grid>
      }
      {
        desc2 &&
        <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%'}}>
          {t(desc2)}
        </Typography>
      }
    </Grid>
  }

  const infoCard = (url: string, title: string, desc: string) => {
    return (
      <Grid item sm={12} sx={{flex: 1,display: 'flex',alignItems: 'center', flexDirection: 'column', py: 14.5, px: 4, border: '1px solid #3A35411F', backgroundColor: '#fff', borderRadius: 3, mx: 4, height: 458}}>
        <Box component="img" src={url} width={114} sx={{mb: 17.5}} />
        <Typography sx={{fontSize: 18, fontWeight: 600, color :'#564A96', mb: 4.5}}>{title}</Typography>
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE'}}>{desc}</Typography>
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
          <Grid item sm={3.5} xs={12}>
            <Hidden smDown>
              <Typography sx={{fontSize: 42, fontWeight: 600, color :'#fff', mb: 4.5}}>{t('Working with the world, applauding for our remote work')}</Typography>
              <Typography sx={{fontSize: 14, fontWeight: 400, color :'#fff'}}>{t('Millions of talents around the world can work for the best companies in the world anytime, anywhere! It sounds like a distant dream. We strive to make managing your global team simple, so don\'t hesitate any longer.')}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography sx={{fontSize: 24, fontWeight: 600, color :'#fff', mb: 4.5, px: 5}}>{t('Working with the world, applauding for our remote work')}</Typography>
              <Typography sx={{fontSize: 14, fontWeight: 400, color :'#fff', px: 5}}>{t('Millions of talents around the world can work for the best companies in the world anytime, anywhere! It sounds like a distant dream. We strive to make managing your global team simple, so don\'t hesitate any longer.')}</Typography>
            </Hidden>
          </Grid>
          <Hidden smDown>
            <Grid item sm={1} />
          </Hidden>
          <Grid item sm={5} xs={11}>
            <Box
              component='img'
              src={`/images/home/choose-us/choose-us-back.png`}
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { maxWidth: 595 },
                width: 595
              })}
            />
          </Grid>
        </Grid>
      </Grid>
      <Section sx={{ background: '#fff', pt: 25 }}>
        <Hidden smDown>
          <Typography sx={{fontSize: 32, fontWeight: 600, color :'#564A96', mb: 16,textAlign: 'center'}}>{t('The future of global human resources, connecting you with your global employees in one-stop')}</Typography>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 8}}>
            {infoCard('/images/home/choose-us/card-icon1.png',  t('Fast remote onboarding process'), t('Create employee basic information in 5 minutes, office equipment delivered online, and enjoy free office space in coworking spaces.'))}
            {infoCard('/images/home/choose-us/card-icon2.png', t('Pay your global team'), t('Just a few clicks to pay your full-time employees and contractors, no need to exchange foreign currency.'))}
            {infoCard('/images/home/choose-us/card-icon3.png',  t('Trusted e-signature contracts'), t('Reliable third-party e-signature system, e-signature has legal effect and is tamper-proof.'))}
            {infoCard('/images/home/choose-us/card-icon4.png', t('Support for localized contracts worldwide'), t('Understanding and complying with local laws abroad is extremely complex. TeleHire is specially hired to do all this for you.'))}
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Typography sx={{fontSize: 22, fontWeight: 600, color :'#564A96', mb: 16,textAlign: 'center'}}>{t('The future of global human resources, connecting you with your global employees in one-stop')}</Typography>
          {infoCard('/images/home/choose-us/card-icon1.png',  t('Fast remote onboarding process'), t('Create employee basic information in 5 minutes, office equipment delivered online, and enjoy free office space in coworking spaces.'))}
          {infoCard('/images/home/choose-us/card-icon2.png', t('Pay your global team'), t('Just a few clicks to pay your full-time employees and contractors, no need to exchange foreign currency.'))}
          {infoCard('/images/home/choose-us/card-icon3.png',  t('Trusted e-signature contracts'), t('Reliable third-party e-signature system, e-signature has legal effect and is tamper-proof.'))}
          {infoCard('/images/home/choose-us/card-icon4.png', t('Support for localized contracts worldwide'), t('Understanding and complying with local laws abroad is extremely complex. TeleHire is specially hired to do all this for you.'))}
        </Hidden>
      </Section>
      <Section sx={{ background: '#fff' }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 20 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          <Grid item sm={6} xs={12}>
            <Box
              component='img'
              src={`/images/home/choose-us/introduction-1.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.5} />
          </Hidden>
          {
            textContent(
              '01/',
              t('Our Mission'),
              t('Why does it take months to recruit employees from another country? How can we avoid inadvertently violating local laws when recruiting temporary workers/contractors? And why isn\'t there a good tool that can solve all these problems?'),
              t('Customer Pain Points'),
              t('Our Solution'),
              t('TeleHire envisions a global labor market that is not restricted by geography, and to make this vision a reality, we must make some changes. Therefore, we went back to the drawing board and thought about solutions to these problems, creating a tool that can help remote teams thrive.'),
            )
          }
        </Grid>
      </Section>

      <Section sx={{ background: '#fff' }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 15 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          {
            textContent(
              '02/',
              t('Realizing the Ideal Global Labor Market'),
              t('By addressing these issues, we quickly discovered that we can open up thousands of virtual doors around the world, which means more companies from around the world can recruit top talent, and more people from different regions can get the jobs they desire. Ultimately, everyone in the world can be employed anywhere.'),
              t('Our Vision'),
              '',
              '',
              4
            )
          }
          <Hidden smDown>
            <Grid item sm={1} />
          </Hidden>
          <Grid item sm={7} xs={12}>
            <Box
              component='img'
              src={`/images/home/choose-us/world-map.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
        </Grid>
      </Section>
      <Section sx={{ background: '#fff' }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 15 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 },
            flexDirection: 'column'
          })}
        >
          <Typography sx={{fontSize: 24, fontWeight: 700, color :'#3A354199', mb: 2}}> 03 /</Typography>
          <AutoTitle title={t('Our Customers')} sx={{mb: 6}} />
          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%', mb: 5}}>
            {t('We sincerely serve each customer and provide them with global recruitment solutions.')}
          </Typography>
        </Grid>
        <Grid container mb={16} spacing={{ sm: 4, xs: 2.5 }} sx={{display: 'flex', justifyContent: 'space-around'}}>
          {data.map((item, index) => (
            <Hidden smUp={index > 4}>
              <Grid item sm={2.2} xs={4}>
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
      <Section sx={{ background: '#fff' }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 15 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 },
            flexDirection: 'column'
          })}
        >
          <Typography sx={{fontSize: 24, fontWeight: 700, color :'#3A354199', mb: 2}}> 04 /</Typography>
          <AutoTitle title={t('Our Team is Connected')} sx={{mb: 6, textAlign: 'left'}} />
          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%', mb: 5}}>
            {t('We have a diverse culture, but we are still able to unite and constantly learn and improve.')}
          </Typography>
        </Grid>
        <Grid container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 25}}>
          <Grid item xs={12} sm={5.8}>
            <Box component="img" src="/images/home/choose-us/left-img.png" width="100%" />
          </Grid>
          <Grid item xs={12} sm={5.8} sx={{display: 'flex', alignItems: 'space-between', justifyContent: 'center', flexDirection: 'column'}}>
            <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Grid item sm={5.8} xs={5.8}>
                <Box component="img" src="/images/home/choose-us/Bitmap.png" width="100%" />
              </Grid>
              <Grid item sm={5.8} xs={5.8}>
                <Box component="img" src="/images/home/choose-us/Bitmap-4.png" width="100%" />
              </Grid>
            </Grid>
            <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Grid item sm={5.8} xs={5.8}>
                <Box component="img" src="/images/home/choose-us/Bitmap-1.png" width="100%" />
              </Grid>
              <Grid item sm={5.8} xs={5.8}>
                <Box component="img" src="/images/home/choose-us/Bitmap-2.png" width="100%" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Section>

      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answering all your questions about global recruitment')}
      />
    </>
  )
}

export default CasePreview
