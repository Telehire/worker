// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'

// ** Page Components Imports
import Section from './components/Section'
import Title from './components/Title'
import Paragraph from './components/Paragraph'
import Button from '@mui/material/Button'

import { Icon } from '@iconify/react'
import Link from 'next/link'

export interface HRIntroductionProps {
  onRequestDemo: (value: boolean) => void
}

const HRIntroduction = (hrIntroductionProps: HRIntroductionProps) => {
  const { onRequestDemo } = hrIntroductionProps
  const { t, i18n } = useTranslation()

  return (
    <>
      <Section sx={{ background: '#f9f8ff' }}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 10, mb: 15 },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          <Grid item sm={5} xs={12} sx={theme => ({ [theme.breakpoints.up('sm')]: { order: 2 } })}>
            <Title>{t('Make your team pay easily around the world')}</Title>
            <Paragraph>
              {t(
                'Use a platform to run payroll in more than 90 countries/regions. The platform aims to simplify international business and eliminate the continuous management of local compliance, taxes, benefits, etc.'
              )}
            </Paragraph>
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
          </Grid>

          <Grid item sm={7} xs={12}>
            <Box
              component='img'
              src={`/images/home/introduction1-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 700 } })}
            />
          </Grid>
        </Grid>
      </Section>

      <Section>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 10, mb: 15 },
            [theme.breakpoints.down('sm')]: { mt: 16, mb: 16 }
          })}
        >
          <Grid item sm={5} xs={12}>
            <Title>{t('Go from offer letter to onboarded in minutes')}</Title>
            <Paragraph>
              {t(
                'Got a new hire in Germany or maybe Brazil? Set them up to work compliantly in minutes. Create a custom contract that’s compliant with local laws, send it to sign, and they will get onboarded almost instantly.'
              )}
            </Paragraph>
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
          </Grid>

          <Grid item sm={7} xs={12}>
            <Box
              component='img'
              src={`/images/home/introduction2-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { maxWidth: 684 } })}
            />
          </Grid>
        </Grid>
      </Section>

      <Section sx={{ background: '#f9f8ff' }}>
        <Grid
          container
          sx={theme => ({
            [theme.breakpoints.up('sm')]: { mt: 10, mb: 15, alignItems: 'center' },
            [theme.breakpoints.down('sm')]: { mt: 9, mb: 11 }
          })}
        >
          <Grid item sm={5} xs={12} sx={theme => ({ [theme.breakpoints.up('sm')]: { order: 2 } })}>
            <Title>{t('We help you comply with local laws and regulations')}</Title>
            <Paragraph>
              {t(
                'It is difficult to become a legal, human resources and accounting expert in every country. Our network of more than 200 local expert partners ensures that all recruitment work complies with regional laws and tax rules, so your team can work anywhere they live.'
              )}
            </Paragraph>
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
          </Grid>

          <Grid item sm={7} xs={12}>
            <Box
              component='img'
              src={`/images/home/introduction3-${i18n.language}.png`}
              sx={theme => ({ [theme.breakpoints.up('sm')]: { width: 577 } })}
            />
          </Grid>
        </Grid>
      </Section>
    </>
  )
}

export default HRIntroduction
