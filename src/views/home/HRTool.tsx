// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'
import Paragraph from './components/Paragraph'
import Button from './components/Button'
import { Icon } from '@iconify/react'

export interface HRToolProps {
  onRequestDemo: (value: boolean) => void
}

const HRTool = (hrToolProps: HRToolProps) => {
  const { t, i18n } = useTranslation()

  const data = [
    {
      subTitle: t(
        'Provide online employee signing template. Avoid the potential risks of employment in various countries'
      )
    },
    {
      subTitle: t('Coordinate the visa processing of employees so that employees can easily work in the target country')
    },
    {
      subTitle: t('API access, working together with your enterprises internal system, more convenient')
    },
    {
      subTitle: t('Provide joint office space for your team through WeWork')
    },
    {
      subTitle: t('Equip your employees with compliance gear, and get them up and running quickly')
    },
    {
      subTitle: t('Overseas salary inquiry system sets local salary standards based on labor costs')
    }
  ]

  return (
    <Section>
      <Title sx={{ textAlign: 'center', sm: { mt: 25, mb: 8 }, xs: { mt: 15, mb: 5 } }}>
        {t('Multiple human resources tools')}
      </Title>

      <Grid container spacing={{ sm: 6, xs: 3 }}>
        {data.map((item, index) => (
          <Grid item sm={2} xs={i18n.language === 'en' ? 6 : 4}>
            <Stack
              alignItems='center'
              sx={theme => ({
                justifyContent: 'space-between',
                height: '100%',
                [theme.breakpoints.up('sm')]: {
                  px: 1,
                  pt: 18,
                  pb: 10,
                  background: '#F9F8FF',
                  borderRadius: 3
                },
                [theme.breakpoints.down('sm')]: {
                  px: 1,
                  py: 5,
                  background: '#F9F8FF',
                  borderRadius: 3,
                  justifyContent: 'space-between'
                }
              })}
            >
              <Box
                component='img'
                src={`/images/home/tool${index + 1}.png`}
                sx={theme => ({
                  [theme.breakpoints.up('sm')]: { width: 90 },
                  [theme.breakpoints.down('sm')]: { width: 40 }
                })}
              />

              <Paragraph color='primary.main' textAlign='center'>
                {item.subTitle}
              </Paragraph>

              <Hidden smDown>
                <Button variant='outlined' href='#' endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}>
                  {t('Get resources')}
                </Button>
              </Hidden>

              <Hidden smUp>
                <Box component='img' src='/images/home/demo-arrow.png' />
              </Hidden>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}

export default HRTool
