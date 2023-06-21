// ** I18n Imports
import { useTranslation } from 'react-i18next'
import { ReactNode, useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import {beforeWrite} from "@popperjs/core";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/router";

// ** Page Components Imports
import Section from '../../components/Section'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import JoinUsWrap from '../../JoinUsWrap'
import Link from 'next/link'


export interface CasePreviewProps {
  onRequestDemo: (value: boolean) => void
  currentCountry: {
    url: string,
    insideUrl: string,
    title: string,
    currency: string,
    lng: string,
    capital?: string,
    cycle?: string
  },
  currentCountryContent: {[key: string]: string}
}

const btnList: {name: string, id: string}[] = [
  {
    name: 'Employee',
    id: 'employ'
  },
  {
    name: 'Public holiday',
    id: 'holiday'
  },
  {
    name: 'Statutory holiday',
    id: 'lawHoliday'
  },
  {
    name: 'Taxation',
    id: 'taxation'
  },
  {
    name: 'Termination of contract/Dismissal of employees',
    id: 'stopContract'
  },
]

const contentIdMap: {[key: string]: string[]} = {
  employ: ['entry', 'salary', 'workTime', 'bonus', 'contract', 'insurance'],
  holiday: ['holiday'],
  lawHoliday: ['holidayWithSalary', 'sickLeave', 'maternityLeaveAndPaternityLeave'],
  taxation: ['individualIncomeTax', 'employerCosts'],
  stopContract: ['stopContract']
}

const keyToLabel: {[key: string]: string} = {
  entry: 'Onboarding',
  salary: 'Salary standard',
  workTime: 'Working hours',
  bonus: 'Bonus',
  contract: 'Labor contract',
  holidayWithSalary: 'Paid leave',
  sickLeave: 'Sick leave',
  maternityLeaveAndPaternityLeave: 'Maternity and paternity leave',
  individualIncomeTax: 'Personal income tax',
  employerCosts: 'Employer Costs',
  insurance: 'Medical insurance'
}



const Resource = (casePreviewProps: CasePreviewProps) => {
  const { onRequestDemo, currentCountry, currentCountryContent } = casePreviewProps
  const { t } = useTranslation()
  const router = useRouter()
  const onBack = () => {
    router.replace('/home/resource')
  }
  const [currentId, setCurrentId] = useState<string>('');

  const scrollToId = (id: string) => {
    setCurrentId(id)
  }


  const infoCard = (url: string, insideUrl: string, title: string, currency: string, lng: string, capital?: string, cycle?: string) => {
    return (
      <Grid item xs={12} sm={3.8} sx={{ padding: 0}}>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 8}}>
            <Box component="img" src={insideUrl} width={56} sx={{mr: 4}} />
            <Typography sx={{fontSize: 32, fontWeight: 500, color :'#3A3541'}}>{t(title)}</Typography>
          </Grid>
        {
          capital && <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 4.5 }}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4, width: 80}}>{`${t('Capital city')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 600, color :'#3A3541DE'}}>{t(capital || '')}</Typography>
          </Grid>
        }
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 4.5 }}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4, width: 80}}>{`${t('currency')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 600, color :'#3A3541DE'}}>{t(currency)}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 4.5 }}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4, width: 80}}>{`${t('language')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 600, color :'#3A3541DE'}}>{t(lng)}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 4.5 }}>
            <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', mr: 4, width: 80}}>{`${t('Salary cycle')}：`}</Typography>
            <Typography sx={{fontSize: 14, fontWeight: 600, color :'#3A3541DE'}}>{t(cycle || '')}</Typography>
          </Grid>
      </Grid>
    )
  }

  const btnContent = (v: {name: string, id: string}) => {
    return (
      <Grid xs={12} sm={12} sx={{bm: 9}} id={v.id} key={v.id}>
        <Typography  sx={{fontSize: 20, fontWeight: 500, color: '#564A96', mb: 10}}>
          {`>${t(v.name)}`}
        </Typography>
        {
          contentIdMap[v.id]?.map((item: string) => {
            return (
              <Grid xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 8}}>
                {
                  keyToLabel[item] && (
                    <Typography  sx={{fontSize: 14, fontWeight: 500, color: '#3A3541', width: 80}}>
                      {t(keyToLabel[item])}
                    </Typography>
                  )
                }
                <Typography  sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', flex: 1}}>
                  {t(currentCountryContent[item])}
                </Typography>
              </Grid>
            )
          })
        }
      </Grid>
    )
  }
  return (
    <>
      <Section sx={{ background: '#fff', pt: 8 }}>
        <Stack direction='row' alignItems='center' onClick={onBack} sx={{ cursor: 'pointer' }}>
          <Box
            component='img'
            src='/images/organization/back.png'
            sx={{ width: 28, height: 28, borderRadius: '50%', background: '#fff' }}
          />
          <Typography variant='body2' sx={{ ml: 2, mr: 6 }}>
            {t('Return')}
          </Typography>
        </Stack>
      </Section>
      <Section sx={{ background: '#fff', pt: 6 }}>
        <Grid container md={12} sm={12} sx={{width: '100%', display: 'flex', alignItems: 'center', mb: 12.5, backgroundColor: '#F9FAFC', borderRadius: 3, py: 5, pl: 5}}>
          <Grid xs={12} sm={4}>
            <Box component="img" src={currentCountry.url} sx={{borderRadius: 3, mr: 10}}  />
          </Grid>
          <Hidden smDown>
            <Grid item sm={0.5} />
          </Hidden>
          {
            infoCard(currentCountry.url, currentCountry.insideUrl, currentCountry.title, currentCountry.currency, currentCountry.lng, currentCountry.capital, currentCountry.cycle)
          }
        </Grid>
      </Section>
      <Hidden smDown>
        <Section sx={{ background: '#fff'}}>
          <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 7}}>
            {
              btnList.map(v => (
                <Button href={`#${v.id}`} variant="text" sx={{fontSize: 14, fontWeight: 500, color: currentId === v.id ? '#7C4DFF' : '#3A3541DE', border: `1px solid ${currentId === v.id ? '#7C4DFF': '#fff'}`, borderRadius: 3, mx: 7}} onClick={() => {scrollToId(v.id)}}>{t(v.name)}</Button>
              ))
            }
          </Grid>
        </Section>
      </Hidden>
      <Section sx={{ background: '#fff'}}>
        {
          btnList.map((v: {id: string, name: string}) => {
            return btnContent(v)
          })
        }
      </Section>
      <JoinUsWrap onRequestDemo={onRequestDemo} />
    </>
  )
}

export default Resource
