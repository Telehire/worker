// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import { Hidden } from '@mui/material'
import Section from './components/Section'

export interface HRPlanProps {
  onRequestDemo: (value: boolean) => void
}

const HRPlan = (hrPlanProps: HRPlanProps) => {
  const { t, i18n } = useTranslation()

  // ** Hook
  const [ref] = useKeenSlider<HTMLDivElement>(
    {
      rtl: true,
      loop: true,
      slides: {
        perView: 2,
        spacing: 10,
        origin: 'center'
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const planList = [
    {
      subTitle: t('Entry stage'),
      title: t('Labor contract signing and employment handling'),
      items: [
        t('Provide employer cost analysis'),
        t('National policy answer'),
        t('Labor contract drafting'),
        t('Employee induction'),
        t('Employee statutory benefits')
      ]
    },
    {
      subTitle: t('Monthly service stage'),
      title: t('Salary calculation, individual income tax and welfare payment'),
      items: [
        t('Salary calculation'),
        t('Social security payment and income tax'),
        t('Employee reimbursement service'),
        t('Daily consultation of employees'),
        t('Provision of other benefits for employees')
      ]
    },
    {
      subTitle: t('Resignation stage'),
      title: t('Process resignation'),
      items: [
        t('Negotiate to terminate the agreement'),
        t('Provide passive resignation process'),
        t('Assist in handling ER relations'),
        t('Complete employee resignation/transfer'),
        ''
      ]
    }
  ]

  return (
    <Section>
      <Typography variant='h4' color='primary.dark' align='center' mt={{ sm: 25, xs: 17 }} mb={8}>
        {t('Overseas talent deployment plan becomes a reality')}
      </Typography>

      <Grid
        container
        spacing={{ xs: 4 }}
        sx={theme => ({
          [theme.breakpoints.up('sm')]: { mb: 25 },
          [theme.breakpoints.down('sm')]: { display: 'none' }
        })}
      >
        {planList.map((item, index) => (
          <Grid item xs={4} sm={4}>
            <Card
              sx={theme => ({
                [theme.breakpoints.up('sm')]: { maxWidth: 405, borderRadius: 3 },
                [theme.breakpoints.down('sm')]: { borderRadius: 1.5 }
              })}
            >
              <CardMedia
                component='img'
                image={`/images/home/plan${index + 1}.png`}
                sx={theme => ({
                  [theme.breakpoints.up('sm')]: { height: 140 },
                  [theme.breakpoints.down('sm')]: { height: 70 }
                })}
              />

              <CardContent
                sx={theme => ({
                  [theme.breakpoints.up('sm')]: {},
                  [theme.breakpoints.down('sm')]: { pt: 5, pb: 8, px: 5, background: '#F9F8FF' }
                })}
              >
                <Typography
                  sx={theme => ({
                    color: '#909399',
                    [theme.breakpoints.up('sm')]: { fontSize: 16 },
                    [theme.breakpoints.down('sm')]: { fontSize: 11 }
                  })}
                >
                  {item.subTitle}
                </Typography>

                <Typography
                  sx={theme => ({
                    color: '#303133',
                    fontWeight: 500,
                    [theme.breakpoints.up('sm')]: { fontSize: 20, mt: 2, mb: 6 },
                    [theme.breakpoints.down('sm')]: { fontSize: 16, mt: 1, mb: 4 }
                  })}
                >
                  {item.title}
                </Typography>

                <Box>
                  {item.items.map((descItem, descIndex) => (
                    <Box
                      display='flex'
                      alignItems='center'
                      visibility={descItem === '' ? 'hidden' : undefined}
                      sx={theme => ({
                        [theme.breakpoints.up('sm')]: { mb: 3 },
                        [theme.breakpoints.down('sm')]: { mb: 1.5 }
                      })}
                    >
                      <Box component='img' src='/images/home/plan-green-check.png' sx={{ width: 20 }} />
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={theme => ({
                          [theme.breakpoints.up('sm')]: { ml: 4 },
                          [theme.breakpoints.down('sm')]: {
                            ml: 2.5,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        })}
                      >
                        {descItem}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Hidden smUp>
        <KeenSliderWrapper>
          <Box ref={ref} className={'keen-slider'} sx={{ mb: 17 }}>
            {planList.map((item, index) => (
              <Box className='keen-slider__slide'>
                <Card
                  sx={theme => ({
                    height: 1,
                    [theme.breakpoints.up('sm')]: { maxWidth: 405, borderRadius: 3 },
                    [theme.breakpoints.down('sm')]: { background: '#F9F8FF', borderRadius: 1.5 }
                  })}
                >
                  <CardMedia
                    component='img'
                    image={`/images/home/plan${index + 1}.png`}
                    sx={theme => ({
                      [theme.breakpoints.up('sm')]: { height: 140 },
                      [theme.breakpoints.down('sm')]: { height: 70 }
                    })}
                  />

                  <CardContent
                    sx={theme => ({
                      [theme.breakpoints.up('sm')]: {},
                      [theme.breakpoints.down('sm')]: { pt: 5, pb: 8, px: 5 }
                    })}
                  >
                    <Typography
                      sx={theme => ({
                        color: '#909399',
                        [theme.breakpoints.up('sm')]: { fontSize: 16 },
                        [theme.breakpoints.down('sm')]: { fontSize: 11 }
                      })}
                    >
                      {item.subTitle}
                    </Typography>

                    <Typography
                      sx={theme => ({
                        color: '#303133',
                        fontWeight: 500,
                        [theme.breakpoints.up('sm')]: {
                          fontSize: 20,
                          mt: 2,
                          mb: 6,
                          height: i18n.language === 'en' ? 60 : 'auto'
                        },
                        [theme.breakpoints.down('sm')]: { fontSize: 16, mt: 1, mb: 4 }
                      })}
                    >
                      {item.title}
                    </Typography>

                    <Box>
                      {item.items.map((descItem, descIndex) => (
                        <Box
                          display='flex'
                          alignItems='center'
                          visibility={descItem === '' ? 'hidden' : undefined}
                          sx={theme => ({
                            [theme.breakpoints.up('sm')]: { mb: 3 },
                            [theme.breakpoints.down('sm')]: { mb: 1.5 }
                          })}
                        >
                          <Box component='img' src='/images/home/plan-green-check.png' sx={{ width: 20 }} />
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={theme => ({
                              [theme.breakpoints.up('sm')]: { ml: 4 },
                              [theme.breakpoints.down('sm')]: {
                                ml: 2.5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }
                            })}
                          >
                            {descItem}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </KeenSliderWrapper>
      </Hidden>
    </Section>
  )
}

export default HRPlan
