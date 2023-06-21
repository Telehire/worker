// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from '../../components/Section'
import HRPlan from '../../HRPlan'
import Typography from '@mui/material/Typography'

import JoinUsWrap from '../../JoinUsWrap'
import FlowPath from '../../../components/flow-path'
import AutoTitle from '../../../components/auto-title'
import {flowPathData} from '../../homeStore/index'

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}

interface cardInfoType {
  url: string,
  index: string,
  title: string,
  desc: string
}
const betweenIconSize = {
  width: 35,
  height: 35
}

const Resource = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()
  const infoCard = (url: string, index: string, title: string, desc: string) => {
    return (
      <Grid item sx={{flex: 1,display: 'flex',alignItems: 'center', flexDirection: 'column', px: 5.5, pt: 10, pb: 6,height: 301, border: '1px solid #3A35411F', backgroundColor: '#F9FAFC', borderRadius: 3, mx: 0.3}}>
        <Box component="img" src={url} width={72} sx={{mb: 8}} />
        <Typography sx={{fontSize: 20, fontWeight: 700, color :'#909399', mb: 2.5}}>{index}</Typography>
        <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 2.5, lineHeight: '140%'}}>{title}</Typography>
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', textAlign: 'center'}}>{desc}</Typography>
      </Grid>
    )
  }

  const infoCard2 = (url: string, title: string, desc:string,  px?: number) => {
    return (
      <Grid item sm={2.8} xs={12} sx={{display: 'flex',alignItems: 'center', flexDirection: 'column',  width: 300, mx: 'auto'}}>
        <Box component="img" src={url} width={230} sx={{mb: 10.5}} />
        <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 2.5, lineHeight: '140%'}}>{t(title)}</Typography>
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', textAlign: 'center', px: px || 12}}>{t(desc)}</Typography>
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
            mb: 2.5
          }}
        >
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          <Grid item sm={3} xs={12} sx={{px: 2}}>
            <Typography sx={{fontSize: 42, fontWeight: 600, color :'#fff', mb: 4.5}}>{t('Hiring local full-time employees for overseas companies')}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#fff'}}>
              {t('Without a local legal entity, TeleHire provides Employer of Record (EOR) services to help companies legally employ staff in foreign countries, manage payroll and benefits, and ensure compliance with all regulatory requirements related to employee onboarding, contracts, insurance, taxes, and compensation.')}
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.5} />
          </Hidden>
          <Grid item sm={4.7} xs={12}>
            <Box
              component='img'
              src={`/images/home/platform/full-time/full-time-back.png`}
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { maxWidth: 750 },
              })}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={1.3} />
          </Hidden>
        </Grid>
      </Grid>
      <HRPlan onRequestDemo={onRequestDemo} />
      <AutoTitle title={t('Remote employee onboarding process of TeleHire')} />
      <FlowPath cardInfo={flowPathData} />
      <Section sx={{ background: '#fff' }}>
        <AutoTitle title={t('Focus on business development and leave the rest to TeleHire')} />
        <Grid container md={12} sm={12} sx={{ mb: 30 }}>
          {infoCard2(
            '/images/home/platform/full-time/item01.png',
            'Reduce onboarding time',
            'HR enters employee and salary information into the system and successfully creates a contract',
           19
          )}
          {infoCard2(
            '/images/home/platform/full-time/item02.png',
            'Assume employment responsibilities and compliance risks',
            'We handle all matters, from contracts, minimum wages, contract terminations, or local laws, fully complying with regulatory requirements'
          )}
          {infoCard2(
            '/images/home/platform/full-time/item03.png',
            'Reliable employee real-name certification and background check',
            'Adopt a reliable third-party real-name certification system to conduct video-based real-person verification of passports, ID cards, driver\'s licenses, and other documents globally'
          )}
          {infoCard2(
            '/images/home/platform/full-time/item04.png',
            'Build your global talent pool',
            'We have legal entities in 90 countries and provide professional visa support, enabling employees from around the world to onboard smoothly'
          )}
        </Grid>
      </Section>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answer all your questions about the Employer of Record')}
      />
    </>
  )
}

export default Resource
