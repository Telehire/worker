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

const leftData: string[] = [
  'Limited to the number of talents in your area;',
  'In areas with high economic levels, companies may need to pay higher employee salaries;',
  'Local employees have first-hand knowledge of their immediate market;',
  'limited to the skill level of workers in your area;。',
  'More opportunities for face-to-face team activities;',
  'Rely on the stability of the local economy and job market.',
]

const rightData: string[] = [
  'Unlimited talent pool',
  'In areas with a low economic level, companies recruiting employees can reduce the cost of employment, while providing competitive wages for the employees there;',
  'International employees have first-hand knowledge of new cultures and markets;',
  'Can hire the best talent, no matter where they are located;',
  'Fewer opportunities for face-to-face group activities;',
  'More resilient due to market diversification.'
]
const cardData = [
  {
    url: '/images/home/global-employ/card3.png',
    title: 'Successfully expand into new markets',
    desc: 'When you hire international staff around the world, you gain insight into cultures and target markets that you would otherwise not have access to. It costs less to hire employees, with over 27% of employees willing to take a pay cut to work from home.'
  },
  {
    url: '/images/home/global-employ/card2.png',
    title: 'Business grows faster',
    desc: 'Researchers compared 5,250 teams and found that decentralized teams achieved success more quickly than non-dispersed teams. Not only do global teams work faster, but 81% of distributed teams experience increased revenue.'
  },
  {
    url: '/images/home/global-employ/card1.png',
    title: 'Diverse and Creative Workforce',
    desc: 'Sourcing talent from around the globe can increase the diversity of your workforce, welcoming fresh perspectives and ideas from people with different backgrounds and experiences. Building a more diverse workforce helps create a more inclusive environment.'
  },
]

const downCardData = [
  {
    url: '/images/home/global-employ/down-card2.png',
    title: 'Cost reduction and efficiency increase',
    desc: 'TeleHire\'s recruitment and employment services can combine recruitment and EOR nominal employer services into one, greatly saving you time and cost, and quickly get assistance from professional teams from 100+ countries and regions around the world'
  },
  {
    url: '/images/home/global-employ/down-card3.png',
    title: 'Efficient expansion',
    desc: 'TeleHire\'s global recruitment network can greatly save you the cost of setting up a local entity, helping you to expand rapidly and develop efficiently in new markets'
  },
  {
    url: '/images/home/global-employ/down-card1.png',
    title: 'High-quality talent pool',
    desc: 'TeleHire\'s huge high-quality international talent pool reserves a large number of high-quality candidates, quickly discovers competent employees for you, and helps you efficiently build an international team'
  },
]

const CasePreview = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()

  const textContent = (title: string, desc: string[], desc1?: string ) => {
    return <Grid item sm={5.5} xs={12}>
      <AutoTitle title={title} sx={{mb: 6, textAlign: 'left'}} />
      <Grid sx={{display: 'flex', alignItems: 'center'}}>
        <Grid sx={{flex: 1}} />
      </Grid>
      <ul style={{paddingLeft: 20}}>
        {
          desc.map(v => (
            <li>
              <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A3541DE', lineHeight: '180%', mb: 4}}>
                {t(v)}
              </Typography>
            </li>
          ))
        }
      </ul>
    </Grid>
  }
  const cardInfo = (item: any, back?: string, noNeedBorder?: boolean) => {
    return (
    <Grid
      item
      xs={12}
      sm={3.7}
      sx={{
        backgroundColor: back || '#F9FAFC',
        borderRadius: 3,
        py: 15,
        px: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: noNeedBorder ? '0px' : '1px solid #3A35411F'
    }}>
      <Box component="img" src={item.url} width={64} sx={{mb: 17}} />
      <Typography sx={{fontSize: 20, fontWeight: 500, color: '#3A3541', mb: 4.5}}>
        {t(item.title)}
      </Typography>
      <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', textAlign:'center'}}>
        {t(item.desc)}
      </Typography>
    </Grid>
    )
  }



  return (
    <>
      <Section sx={{ background: '#fff' }}>
        <Grid
          container
          sm={12}
          md={12}
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 20 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 },
            backgroundColor: '#7C4DFF',
            borderRadius: 3
          })}
        >
          <Grid item sm={4.5} xs={12} sx={{pl: 13}}>
            <Typography sx={{fontSize: 16, fontWeight: 400, color: '#fff', lineHeight: '180%'}}>
              {t('Global Employment Solutions')}
            </Typography>
            <AutoTitle title={t('Global Recruiting and Hiring')} sx={{color: '#fff',textAlign: 'left',mb: 2.5}} />
            <Typography sx={{fontSize: 16, fontWeight: 400, color: '#fff', lineHeight: '180%'}}>
              {t('Quickly recruit the world\'s top talents through TeleHire special recruitment.')}
            </Typography>
          </Grid>
          <Grid item sm={7.5} xs={12}>
            <Box
              component='img'
              src={`/images/home/global-employ/back.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700, borderRadius: '0 20px 20px 0' }})}
            />
          </Grid>
        </Grid>
      </Section>
      <Section sx={{pb: 20,mb: 15}}>
        <AutoTitle title={t('Local Hiring vs. Global Hiring')} />
        <Grid container>
          <Grid
            item
            sx={theme => ({
              [theme.breakpoints.up('sm')]: { height: 396 },
              backgroundColor: '#CDF4DF',
              borderRadius: 3,
              py: 18,
              px: 18,
              maxWidth: 665,
              width: 665,
            })}
            >
            <Typography sx={{fontSize: 24, fontWeight: 500, color: '#178E4E', lineHeight: '180%',display: 'flex',alignItems: 'center'}}>
              <Icon icon="material-symbols:location-on-outline" width={20} style={{marginRight: 6}} />
              {t('Local recruitment')}
            </Typography>
            <ul  style={{paddingLeft: 20}}>
              {
                leftData.map(v => (
                  <li>
                    <Typography sx={{fontSize: 14, fontWeight: 400, color: '#000', lineHeight: '220%',display: 'flex',alignItems: 'center'}}>
                      {t(v)}
                    </Typography>
                  </li>
                ))
              }
            </ul>
          </Grid>
          <Grid
            item
            sx={theme => ({
              [theme.breakpoints.up('sm')]: {  pr: 55,  ml: -20, mt: 19 },
              [theme.breakpoints.down('sm')]: {  pr: 18, mt: 10 },
              backgroundColor: '#F6F5FF',
              borderRadius: 3,
              py: 18,
              pl: 18,
              maxWidth: 665,
              width: 665,

              minHeight: 396
            })}
           >
            <Typography sx={{fontSize: 24, fontWeight: 500, color: '#7C4DFF', lineHeight: '180%',display: 'flex',alignItems: 'center'}}>
              <Icon icon="mdi:world-wide-web" width={20} style={{marginRight: 6}} />
              {t('Global Recruitment')}
            </Typography>
            <ul  style={{paddingLeft: 20}}>
              {
                rightData.map(v => (
                  <li>
                    <Typography sx={{fontSize: 14, fontWeight: 400, color: '#000', lineHeight: '220%',display: 'flex',alignItems: 'center'}}>
                      {t(v)}
                    </Typography>
                  </li>
                ))
              }
            </ul>
          </Grid>
        </Grid>
      </Section>
      <Section>
        <AutoTitle title={t('Next stop at sea? as you wish')} sx={{mb: 5}} />
        <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A3541', lineHeight: '180%',textAlign: 'center'}}>
          {t('TeleHire never stops expanding, establishing new entities in new markets. Work hard for you to hire global EOR staff and achieve rapid growth.')}
        </Typography>
        <Grid
          container
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 },
          })}
        >
          {
            cardData.map(v => (
              cardInfo(v)
            ))
          }
        </Grid>
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
          <Grid item sm={5.8} xs={12}>
            <Box
              component='img'
              src={`/images/home/global-employ/item1-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.7} />
          </Hidden>
          {
            textContent(
              t('High-efficiency recruitment + comprehensive review, quickly recruit global high-quality talents'),
              [
                t('Talent is the engine of company development. Through TeleHire\'s special recruitment and employment services, you can quickly recruit qualified and high-quality talents around the world to form your international team.'),
              ]
            )
          }
        </Grid>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 11, mb: 20 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          {
            textContent(
              t('Worry-free compliance and easy resolution of cross-regional obstacles'),
              [
               t('No need to worry about compliance issues, TeleHire\'s specially hired professional team can quickly locate candidates for you, recruit excellent talents legally and compliantly, and solve your recruitment problems.'),
                t('TeleHire\'s global team is located in more than 100 countries/regions, which can quickly and efficiently tap local talents for you'),
                t('TeleHire\'s global employment solutions will solve all the problems of cross-border employment for you, allowing you to focus on business expansion and achieve global growth.'),
                t('Recruit and hire top talent quickly, compliantly and efficiently with our in-country experts'),
              ]
            )
          }  <Hidden smDown>
          <Grid item sm={0.7} />
        </Hidden>
          <Grid item sm={5.8} xs={12}>
            <Box
              component='img'
              src={`/images/home/global-employ/item2-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
        </Grid>
      </Section>
      <Grid container md={12} xs={12} sx={{backgroundColor: '#F6F5FF', pt: 17}}>
        <Hidden smDown>
          <Grid item xs={2} />
        </Hidden>
        <Grid container md={8} xs={12} sx={{backgroundColor: '#F6F5FF'}}>
          <AutoTitle title={t('TeleHire, Your Remote Recruitment Consultant')} sx={{width: '100%', mb: 6}} />
          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#000',display: 'flex',alignItems: 'center',justifyContent: 'center', mb: 7, width: '100%'}}>
            {t('Solving difficult-to-recruit positions is an important issue in global recruitment. Whether it is technology, sales, customer service or other hard-to-find positions, TeleHire Special Recruitment will provide you with a one-stop solution.')}
          </Typography>
          <Grid container md={12} xs={12} sx={{backgroundColor: '#F6F5FF',display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {
              downCardData.map((v: any) => (
                cardInfo(v, '#F6F5FF', true)
              ))
            }
          </Grid>
        </Grid>
      </Grid>
      <Section sx={{pt: 31, pb: 40}}>
        <AutoTitle title={t('Global talent, all in TeleHire')} sx={{width: '100%', mb: 6}} />
        <Typography sx={{fontSize: 14, fontWeight: 400, color: '#000',display: 'flex',alignItems: 'center',justifyContent: 'center', mb: 18}}>
          {t('Global recruitment is overwhelming. TeleHire can meet your global recruitment needs end-to-end, helping you recruit global talents without leaving your home.')}
        </Typography>
        <Box component="img" src={`/images/home/global-employ/item3-${i18n.language}.png`} width="100%" />
      </Section>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answer all your questions about the Employer of Record')}
      />
    </>
  )
}

export default CasePreview
