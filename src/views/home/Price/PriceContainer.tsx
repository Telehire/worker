// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from '../components/Section'
import { useEffect, useState } from 'react'
import Title from '../components/Title'
import Paragraph from '../components/Paragraph'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import JoinUsWrap from '../JoinUsWrap'
import Link from 'next/link'
import {beforeWrite} from "@popperjs/core";
import AutoTitle from '../../components/auto-title'

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}


let timer: any;

const PriceContainer = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()
  const [left, setLeft] = useState<number>(0)
  useEffect(() => {
    changeLeft()
    return  clearTimeout(timer);
  }, [])

  useEffect(() => {
    clearTimeout(timer);
    changeLeft()
  }, [left])

  const changeLeft = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if(left > - 1600) {
        setLeft(left - 1.5)
      }else {
        setLeft(0)
      }

      changeLeft()
    }, 5)
  }

  const priceCard = (title: string, price: string, desc: string, tips: string, content: string[], color?: string) => {
    return (
      <Grid item sx={{width: '25rem',display: 'flex',alignItems: 'center', flexDirection: 'column', pb: 3, backgroundColor: '#F9FAFC', borderRadius: 3, mx: 3, overflow: 'hidden', height: 843}}>
        <Grid item sx={{backgroundColor: color || '#FFB400', height: '10px', width: '100%', mb: 4 }} />
        <Typography sx={{fontSize: 20, fontWeight: 600, color :'#564A96', mb: 6, lineHeight: '140%'}}>{t(title)}</Typography>
        <Typography sx={{fontSize: 46, fontWeight: 700, color :'#3A3541DE', mb: 2.5}}>{t(price)}</Typography>
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE', mb: 2.5, height: 14}}>{t(desc)}</Typography>
        <Typography sx={{fontSize: 16, fontWeight: 400, color :'#564A96', mb: 17, px: 3}}>{t(tips)}</Typography>
        <Grid mb={12}>
          {
            content.map ((v: string) => (
              <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mb: 5, display: 'flex', alignItems: 'center'}}>
                <Icon icon="material-symbols:check-small" style={{marginRight: 4,width: 20, height: 20, color: '#15BC83'}} />
                {t(v)}
              </Typography>
            ))
          }
        </Grid>
        <Button
          href='/'
          component={Link}
          variant='outlined'
          onClick={onRequestDemo}
          endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
          sx={{
            margin: 0,
            borderRadius: 4,
            color: '#7159F9',
            backgroundColor: '#F1F0FF',
            borderColor: 'transparent',
            my: 6
          }}
        >
          {t('Contacts')}
        </Button>
      </Grid>
    )
  }

  const betweenIconSize = {
    width: 30,
    height: 35
  }

  return (
    <>
      <Grid item xs={12} sm={12} sx={{backgroundColor: '#7C4DFF',height: 313}}>
        <Box component="img" src='/images/home/price/banner-back.png' width="100%" height="100%" />
      </Grid>
      <Section sx={{ background: 'rgba(255,255,255,0)', mt: -70 }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 23 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          {
            priceCard(
              t('EOR staff'),
              '$149',
              t('Each employee per month'),
              t('Hiring employees in a country/region where you don\'t have a physical presence'),
              [
                'Localized agreement',
                'Employee identity authentication',
                'Payroll processing including all taxes and deductions',
                'Special benefits such as vacation, reimbursement, and bonuses',
                'Vacation, expense reimbursement, and bonus.',
                'Trustworthy electronic signature (QES)',
                'Providing guides for overseas countries',
                'Tax compliance',
              ]
            )
          }
          {
            priceCard(
              'Temporary workers/contractors:',
              '$79',
              'Each temporary worker per month',
              'Recruiting temporary workers/contractors in over 150+ countries',
              [
                'Localized agreement',
                'Contractor identity authentication',
                'Automatic invoicing',
                'Allowances and benefits, such as vacation and reimbursement',
                'Vacation, expense reimbursement ',
                'Trustworthy electronic signature (QES)',
                'Compliance classification',
                'Screening for negative/criminal records',
              ]
            )
          }
          {
            priceCard(
              'Payroll service:',
              'Obtaining a quote',
              ' ',
              'Helping you streamline payroll services for direct employees in multiple countries/regions',
              [
                'Integrating payroll processing for multiple countries',
                'Accessing payroll report',
                'Assisting with local tax declarations',
                'Global benefits compliance',
                'Social/business insurance',
                'Continuous HR support',
                '24/7 service desk',
                'Open platform API',
              ]
            )
          }
        </Grid>
      </Section>
      <Section sx={{backgroundColor: '#fff'}}>
        <AutoTitle title={t('Additional services:')} />
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 23 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          {
            priceCard(
              'Employee insurance:',
              '$79',
              'Each employee per month',
              'Providing global business insurance',
              [
                'Standard insurance package covering the globe',
                'Can add coverage for family members',
                'No deductible',
                'Quick claims processing',
                '24-hour online customer service',
              ],
              '#9E69FD'
            )
          }
          {
            priceCard(
              'Global visa',
              'Obtaining a quote',
              'Pricing for VISA services is subject to various factors：',
              'Supporting visa and residence permit applications',
              [
                'Hiring country:',
                'Position',
                'Work experience',
                'Nationality',
                'Annual salary',
                'Current residence',
              ],
              '#9E69FD'
            )
          }
        </Grid>
      </Section>
      <Grid item xs={12} sm={12}>
        <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4.5}}>
          <Typography sx={{height: 6, width: 6, backgroundColor: '#564A96', borderRadius: 2}} />
          <Typography sx={{fontSize: 26, fontWeight: 600, color :'#564A96', textAlign: 'center', mx: 4}}>{t('TeleHire open platform')}</Typography>
          <Typography sx={{height: 6, width: 6, backgroundColor: '#564A96', borderRadius: 2}} />
        </Grid>
        <AutoTitle title={t('Committed to creating an open ecosystem for recruitment')} />
        <Typography sx={{fontSize: 14, fontWeight: 300, color :'#564A96', textAlign: 'center', mb: 13, px: 6}}>{t('Open from the aspects of basic capabilities, content, data, and services, supporting the integration of various HR and financial software, providing developers with efficient and convenient solutions')}</Typography>
      </Grid>
      <Grid item xs={12} sm={12} sx={{overflow: 'hidden'}}>
        <Grid sx={{display: 'flex', marginLeft: `${left}px`,mb: 5}}>
          <Box component="img" src="/images/home/price/price-logo1.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo2.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo3.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo4.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo5.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo6.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo7.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo1.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo2.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo3.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo4.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo5.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo6.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo7.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
        </Grid>
        <Grid sx={{display: 'flex', marginLeft: `${left - 114}px`, mb: 5}}>
          <Box component="img" src="/images/home/price/price-logo8.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo9.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo10.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo11.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo12.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo13.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo14.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo8.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo9.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo10.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo11.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo12.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo13.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
          <Box component="img" src="/images/home/price/price-logo14.png" width="200px" minWidth="200px" sx={{mx: 3.5}} />
        </Grid>
      </Grid>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answering all your questions about global recruitment')}
      />
    </>
  )
}

export default PriceContainer
