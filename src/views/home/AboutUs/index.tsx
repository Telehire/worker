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

const CasePreview = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo } = casePreviewProps
  const { t, i18n } = useTranslation()

  const textContent = (title: string, desc: string[], desc1?: string ) => {
    return <Grid item sm={5.5} xs={12}>
      <AutoTitle title={title} sx={{mb: 6, textAlign: 'left', color: '#3A3541'}} />
      <Grid sx={{display: 'flex', alignItems: 'center'}}>
        <Grid sx={{flex: 1}} />
      </Grid>
      {
        desc1 &&  <Typography sx={{fontSize: 18, fontWeight: 500, color: '#3A3541', lineHeight: '180%'}}>
          {t(desc1)}
        </Typography>
      }
      {
        desc.map(v => (
          <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A3541DE', lineHeight: '180%'}}>
            {t(v)}
          </Typography>
        ))
      }
    </Grid>
  }


  return (
    <>
      <Grid item xs={12} sm={12} sx={{mb: 17}}>
        <Box component="img" src="/images/home/about-us/back.png" width="100%" />
      </Grid>
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
          {
            textContent(
              t('About us'),
              [t('TeleHire is an all-in-one global team remote management and payroll platform specializing in the globalization of GLobal companies. Through our SaaS products, we provide comprehensive team management solutions including contract setup, signing, and salary payment.')]
            )
          }
          <Hidden smDown>
            <Grid item sm={0.7} />
          </Hidden>
          <Grid item sm={5.8} xs={12}>
            <Box
              component='img'
              src={`/images/home/about-us/item1.png`}
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
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          <Grid item sm={5.8} xs={12}>
            <Box
              component='img'
              src={`/images/home/about-us/item2.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.7} />
          </Hidden>
          {
            textContent(
              t('Team experience'),
              [
                t('Our exceptional products and technical understanding will continuously support the iteration of your business needs. Our deep understanding of the internet industry and rich global resources will continuously introduce new partners to support the development of your global business.'),
                t('GLobal companies that have expanded overseas continue to grow explosively after years of accumulation, our team, with extensive experience in servicing global companies, is your reliable support. TeleHire is here to allow you to concentrate on the sustainable growth of your business without worrying about remote team management and payments.')
              ]
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
              t('Contact us'),
              [
                t('Address: 1401 21st Street Suite R, Sacramento, CA 95811.'),
                t('Email: info@telehire.net')
              ],
              t('TeleHire Inc.'),
            )
          }
          <Hidden smDown>
            <Grid item sm={0.7} />
          </Hidden>
          <Grid item sm={5.8} xs={12}>
            <Box
              component='img'
              src={`/images/home/about-us/item3-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 }})}
            />
          </Grid>
        </Grid>
      </Section>
      <JoinUsWrap
        onRequestDemo={onRequestDemo}
        title={t('Answer all your questions about the Employer of Record')}
      />
    </>
  )
}

export default CasePreview
