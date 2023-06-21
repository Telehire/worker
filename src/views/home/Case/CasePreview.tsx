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
import FlowPath from '../../components/flow-path'
import AutoTitle from '../../components/auto-title'
import { flowPathData, partTimeFlowPathData } from '../homeStore/index'

export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
}

const CasePreview = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()

  const textContent = (index: string, title: string, desc: string, btnText: string, desc2?: string, desc3?: string) => {
   return <Grid item sm={4} xs={12}>
      <Typography sx={{fontSize: 24, fontWeight: 700, color :'#3A3541DE', mb: 2}}>{index}</Typography>
      <AutoTitle title={title} sx={{mb: 6, textAlign: 'left'}} />
      <Grid sx={{display: 'flex', alignItems: 'center'}}>
         <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', backgroundColor: '#9155FD14', py: 1, px: 7, maxWidth: 250, borderRadius: 19,textAlign: 'center', mb: 5}}>{btnText}</Typography>
         <Grid sx={{flex: 1}} />
      </Grid>
      <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%'}}>
        {t(desc)}
      </Typography>
     {
       desc2 &&  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%', mt: 3}}>
         {desc2}
       </Typography>
     }
     {
       desc3 &&  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#333333', lineHeight: '180%', mt: 3}}>
         {desc3}
       </Typography>
     }
    </Grid>
  }

  return (
    <>
      <Section sx={{ background: '#fff' }}>
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
            textContent(
            '01/',
            t('Startups/Branding '),
              t('Many startups struggle with payment and onboarding processes because they use multiple tools like Docusign and Google Forms, which can lead to errors in the chaos. For Taiwanese startups or web3 companies, using Telehire to recruit international team members is not only cost-effective but also beneficial for company growth. However, navigating the maze of global laws can be difficult, and many startups can easily run into serious compliance issues due to small mistakes. We help companies hire remote workers in compliance with local regulations, including salary, taxes, insurance, health checkups, and support payment in 120 currencies.'),
              t('problem')
            )
          }
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          <Grid item sm={6.5} xs={12}>
            <Box
              component='img'
              src={`/images/home/case/introduction4-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
        </Grid>
      </Section>
      <Section sx={{ background: '#fff' }}>
        <AutoTitle title={t('Remote employee onboarding process of TeleHire')} />
        <FlowPath cardInfo={flowPathData} />
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
          <Grid item sm={6.5} xs={12}>
            <Box
              component='img'
              src={`/images/home/case/introduction2-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          {
            textContent(
              '02/',
              t('Manufacturing'),
              t('Look no further than our EOR services. By partnering with us, you can focus on growing your business while we handle the administrative tasks of hiring and managing employees. Our experienced team ensures compliance with local laws and regulations, including payroll, benefits, and taxes, so you can avoid costly mistakes and penalties.As your EOR, we take care of everything from onboarding to offboarding, including employment contracts, visas, and work permits. You can rest assured that your team members are well taken care of, with access to benefits such as health insurance and retirement plans.With our EOR services, you can streamline your HR operations, reduce costs, and increase your global presence. Partner with us and experience the benefits of a flexible and scalable workforce, all while remaining compliant and reducing risk.'),
              t('problem')
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
              '03/',
              t('Livestreaming Ecommerce '),
              t('In recent years, the live streaming e-commerce industry has faced external environmental changes and is developing towards a more refined and compliant operation direction. Meanwhile, direct sales platforms such as TikTok e-commerce are exploring new markets to find incremental growth.'),
              t('problem'),
              t('According to a report by the renowned market research firm Technavio, the global direct sales market is set to grow at a compound annual growth rate (CAGR) of over 21% between 2022 and 2026. The market model is projected to increase from 300 million yuan in 2021 to nearly 1 billion yuan in 2026. Visual, audio, and hybrid live streaming are expected to experience rapid growth, with fast-growing application areas including education and sports. In terms of regional growth, the Asia-Pacific region is expected to be the main driving force.')
            )
          }
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          <Grid item sm={6.5} xs={12}>
            <Box
              component='img'
              src={`/images/home/case/introduction3-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
        </Grid>
      </Section>
      <Section sx={{ background: '#fff' }}>
        <AutoTitle title={t('TeleHire Special Recruitment - remote management of temporary workers/contractors')} />
        <FlowPath cardInfo={partTimeFlowPathData} />
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
          <Grid item sm={6.5} xs={12}>
            <Box
              component='img'
              src={`/images/home/case/introduction1-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={1.5} />
          </Hidden>
          {
            textContent(
              '04/',
              t('Web3 and Crypto industry'),
              t('The globalization of tech companies and web3 enterprises is rapidly unfolding, with emerging industries such as web3 enterprises and cryptocurrency industries heavily recruiting. This is an excellent opportunity to get involved. You don\'t need to be a developer, as there are non-technical roles such as writing, research, and community management available. Web3 also has demand for traditional roles such as assistants, HR, and engineers. We even accept payment in cryptocurrency from web3 enterprises, eliminating the need for frequent exchange transactions. This also allows employees who accept payment in cryptocurrency to quickly access benefits such as local compliance with insurance and credit card qualifications.'),
              t('Opportunities and trends'),
              t('From a global perspective, labor costs in developed countries are increasing, which is a trend. The globalization of IT enterprises\' recruitment is also a major trend. For the human resources departments of companies, one of the competitiveness factors is the cost-effectiveness of employees.'),
              t('The external opportunities brought about by Web3 have brought more overseas employment opportunities for IT industry practitioners.')
            )
          }
        </Grid>
      </Section>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title='Answering all your questions about global recruitment'
      />
    </>
  )
}

export default CasePreview
