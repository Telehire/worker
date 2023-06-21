// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from '../../components/Section'
import HRPlan from '../../HRPlan'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import JoinUsWrap from '../../JoinUsWrap'
import FlowPath from '../../../components/flow-path'
import AutoTitle from '../../../components/auto-title'
import { partTimeFlowPathData } from '../../homeStore/index'

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}
const betweenIconSize = {
  width: 35,
  height: 35
}

const infoCard2Data: {index: string,title: string,content: string[]}[] = [
  {
    index: '01/',
    title: 'Fixed-fee contracts',
    content: [
      'Suitable for projects billed by the hour',
      'Supports weekly/bi-weekly/monthly payment frequency',
      'Set a pay date',
      'Set the amount of compensation',
      'Automatically generate invoices',
      'Pay-as-you-go/invoice contracts'
    ]
  },
  {
    index: '02/',
    title: 'Pay-as-you-go/invoice contracts',
    content: [
      'Suitable for projects paid based on work results',
      'Can be paid by time or task',
      'Payment bills are generated only after approval of submitted work results',
      'Can adjust bills, add bonuses, and expenses',
      'Temporary workers/contractors can submit work on the platform',
      'Companies can freely adjust the bill'
    ]
  },
  {
    index: '03/',
    title: 'KPI project-based contracts',
    content: [
      'Suitable for project-based and milestone-based tasks',
      'Can break down projects into multiple KPIs',
      'Set a payment amount for each KPI',
      'Temporary workers/contractors can submit KPIs on the platform',
      'After approval by the company, a payment bill is generated'
    ]
  },
]

const PartTime = (casePreviewProps: CasePreviewProps) => {
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

  const infoCard2 = (i:number, index: string, title: string, content:string[]) => {
    return (
      <Grid item xs={12} sm={3.8} sx={{display: 'flex',alignItems: 'center', flexDirection: 'column', borderRadius: 3,border: '1px solid #3A35411F', overflow: 'hidden', pb: 7.5, mx: 'auto', mb: 3}}>
       <Grid xs={12} sm={12} sx={{width: '100%', backgroundColor: '#516FF3',minHeight: 162, maxHeight: 162, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
         <Box component="img" src={`/images/home/platform/part-time/item${i+1}.png`} width={104} />
       </Grid>
        <Grid item sx={{width: '100%', textAlign: 'left', pl: 10, mt: 3.5}}>
          <Typography sx={{fontSize: 14, fontWeight: 400, color :'#909399', mb: 2,}}>{index}</Typography>
          <Typography sx={{fontSize: 20, fontWeight: 500, color :'#303133', mb: 6, }}>{t(title)}</Typography>
            {
              content.map ((v: string) => (
                <Typography sx={{fontSize: 14, fontWeight: 400, color :'#303133', mb: 5, display: 'flex', alignItems: 'center'}}>
                  <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 20, height: 20, color: '#15BC83'}} />
                  {t(v)}
                </Typography>
              ))
            }
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
            mb: 27.5
          }}
        >
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          <Grid item sm={4.1} xs={12} sx={{px: 2}}>
            <Typography sx={{fontSize: 42, fontWeight: 600, color :'#fff', mb: 4.5}}>{t('Hire temporary workers/contractors worldwide and execute contracts in compliance')}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#fff'}}>
              {t('Automate the signing of agreements, onboarding, contractor compliance classification, invoice generation, and payment processing so that you can focus on business growth.')}
            </Typography>
          </Grid>
          <Grid item sm={4.2} xs={12}>
            <Box
              component='img'
              src={`/images/home/platform/part-time/part-time-back.png`}
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
      <Section sx={{ background: '#fff' }}>
        <Grid container md={12} sm={12} sx={{mb: 24}}>
          <AutoTitle title={t('Multiple contract models and payment options to choose from')} />
          <Grid container md={12} sm={12}>
            {
              infoCard2Data.map((v: any, index: number) => {
                return infoCard2(index, v.index, v.title, v.content)
              })
            }
          </Grid>
        </Grid>
      </Section>
      <Section sx={{ background: '#fff' }}>
        <AutoTitle title={t('TeleHire Special Recruitment - remote management of temporary workers/contractors')} />
        <FlowPath cardInfo={partTimeFlowPathData} />
      </Section>
      <Section sx={{ background: '#fff' }}>
        <AutoTitle title={t('You focus on business development and let TeleHire take care of the rest')} />
        <Grid container sm={12} sx={{display: 'flex', alignItems: 'center', mb: 25}}>
          <Grid item xs={12} sm={5} sx={{mb: 4}}>
            <Box
              component='img'
              src={`/images/home/platform/part-time/left-back.png`}
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { maxWidth: 750 },
              })}
            />
          </Grid>
          <Hidden smDown>
            <Grid sm={1} />
          </Hidden>
          <Grid  item xs={12} sm={6}>
            <Grid container md={12} sm={12} sx={{mb: 10}}>
              <Grid item sm={4} xs={12} sx={{mb: 10}}>
                <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 5, display: 'flex', alignItems: 'center'}}>
                  <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 24, height: 24, color: '#15BC83'}} />
                  {t('Localized agreement')}
                </Typography>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>
                  {t('Create, send, and sign contracts that comply with local laws in seconds, protecting your business from unnecessary risks.')}
                </Typography>
              </Grid>
              <Hidden smDown>
                <Grid sm={2} />
              </Hidden>
              <Grid item sm={4} xs={12}>
                <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 5, display: 'flex', alignItems: 'center'}}>
                  <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 24, height: 24, color: '#15BC83'}} />
                  {t('Automatically create invoices')}
                </Typography>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>
                  {t('Save management time and automate the entire invoicing process. Instantly generate digital invoices for each payment and seamlessly synchronize all your data with your favorite accounting tools.')}
                </Typography>
              </Grid>
            </Grid>
            <Grid container md={12} sm={12}>
              <Grid item sm={4} xs={12}  sx={{mb: 10}}>
                <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 5, display: 'flex', alignItems: 'center'}}>
                  <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 24, height: 24, color: '#15BC83'}} />
                  {t('Pay everyone at once')}
                </Typography>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>
                  {t('You can view the salaries of your entire team and pay each person in local currency with just a click. Simply choose any of the 100 currencies we support to make a bulk payment to TeleHire.')}
                </Typography>
              </Grid>
              <Hidden smDown>
                <Grid sm={2} />
              </Hidden>
              <Grid item sm={4} xs={12}>
                <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 5, display: 'flex', alignItems: 'center'}}>
                  <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 24, height: 24, color: '#15BC83'}} />
                  {t('15 withdrawal methods')}
                </Typography>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>
                  {t('Provide contractors with over 15 payment methods, including cryptocurrency. In addition, they can save on exchange rates and fees, and you don\'t even have to lift a finger.')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Section>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answer all your questions about global temporary workers/contractors.')}
      />
    </>
  )
}

export default PartTime
