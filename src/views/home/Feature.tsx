// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import Button from '@mui/material/Button'
import Feature1 from '../../components/svg/home/Feature1'
import Feature2 from '../../components/svg/home/Feature2'
import Feature3 from '../../components/svg/home/Feature3'
import Link from 'next/link'

import { Icon } from '@iconify/react'

export interface FeatureProps {
  onRequestDemo: (value: boolean) => void
}

const Feature = (featureProps: FeatureProps) => {
  const { onRequestDemo } = featureProps
  const { t } = useTranslation()

  const featureList = [
    {
      title: t('EOR Global Nominal Employer'),
      description: t(
        'In the absence of a local legal entity, through EOR services, TeleHire is specially employed to help enterprises legally employ employees in the host country, manage the salary distribution of employees, and ensure that all employees meet the legal requirements of employment, contract signing, insurance, tax and salary.'
      ),
      icon: Feature1
    },
    {
      title: t('Flexible Employment'),
      description: t(
        'Flexible employment is a concept opposite to the traditional fixed and rigid full-time employment mode. It is a new employment mode rising with the changing market economic situation. TeleHire is specially employed to help employers complete the salary compliance formulation of independent contractors. Avoid many avoidable procedural and legal obstacles.'
      ),
      icon: Feature2
    },
    {
      title: t('Payroll Service'),
      description: t(
        'TeleHire is a one-stop salary payment management platform specially designed for offshore enterprises. It uses a unified salary solution to coordinate the currencies of more than 150 countries/regions and pay salaries for employees around the world. For the overseas salary query needs of enterprises, global salary query will be launched soon.'
      ),
      icon: Feature3
    }
  ]

  return (
    <Section>
      <Grid
        container
        spacing={6}
        sx={theme => ({
          [theme.breakpoints.up('sm')]: { mt: 12, mb: 16 },
          [theme.breakpoints.down('sm')]: { mt: 1, mb: 6 }
        })}
      >
        {featureList.map((item, i) => (
          <Grid item xl={4} md={4} xs={12}>
            <Box
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                [theme.breakpoints.down('sm')]: { p: 5, border: '1px solid #DCDFE6', borderRadius: 3 }
              })}
            >
              <Stack
                sx={theme => ({
                  [theme.breakpoints.up('sm')]: { alignItems: 'center' },
                  [theme.breakpoints.down('sm')]: { position: 'relative', flexDirection: 'row', alignItems: 'center' }
                })}
              >
                {i === 0 && <Feature1 />}
                {i === 1 && <Feature2 />}
                {i === 2 && <Feature3 />}

                <Typography
                  sx={theme => ({
                    color: 'primary.dark',
                    lineHeight: '140%',
                    fontWeight: 600,
                    [theme.breakpoints.up('sm')]: { fontSize: 24, mt: 8, mb: 4 },
                    [theme.breakpoints.down('sm')]: { fontSize: 16, ml: 4 }
                  })}
                >
                  {item.title}
                </Typography>

                <Hidden smUp>
                  <Box

                    // component='img'
                    // src='/images/home/demo-arrow.png'
                    sx={{ position: 'absolute', right: 6, top: 16, color: 'primary.dark' }}
                  >
                    <Icon icon='material-symbols:arrow-right-alt-rounded'/>
                  </Box>
                  
                </Hidden>
              </Stack>

              <Typography
                sx={theme => ({
                  color: 'primary.dark',
                  fontWeight: 400,
                  [theme.breakpoints.up('sm')]: { width: 308, fontSize: 14, lineHeight: '200%', textAlign: 'center' },
                  [theme.breakpoints.down('sm')]: { fontSize: 11, lineHeight: '180%', mt: 3 }
                })}
              >
                {item.description}
              </Typography>

              <Hidden smDown>
                <Button
                  href='/'
                  component={Link}
                  variant='outlined'
                  onClick={onRequestDemo}
                  endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
                  sx={theme => ({
                    borderRadius: 4,
                    backgroundColor: '#f1f0ff',
                    borderColor: 'transparent',
                    my: 6
                  })}
                >
                  {t('Request A Demo')}
                </Button>
              </Hidden>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}

export default Feature
