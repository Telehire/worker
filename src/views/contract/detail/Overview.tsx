// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Types
import { ProfileTabType } from 'src/@fake-db/types'
import Card from '@mui/material/Card'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Icon from '../../../@core/components/icon'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import StepLabel from '@mui/material/StepLabel'
import { useTranslation } from 'react-i18next'
import CustomChip from 'src/@core/components/mui/chip'

const Overview = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  const Title = (props: { title: string; description?: string }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Typography sx={{ fontSize: 14, color: theme.palette.text.primary, fontWeight: 500 }}>{props.title}</Typography>
      {props.description && (
        <Typography sx={{ fontSize: 12, color: '#FF943E', background: '#FFF6F0', px: 1 }}>
          {props.description}
        </Typography>
      )}
    </Box>
  )

  const Cell = (props: {
    title: string
    value: string
    valueDesc?: string
    desc?: string
    showIcon?: boolean
    description?: string
  }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        py: 2.25
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, width: 136 }}>
          {props.title}
          {props.showIcon && (
            <IconButton sx={{ verticalAlign: 'middle', p: 0, ml: 1 }}>
              <Icon icon='material-symbols:info-outline' width={15} color={theme.palette.info.main} />
            </IconButton>
          )}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontSize: 14, color: theme.palette.text.primary, fontWeight: 500 }}>
            {props.value}
          </Typography>
          {props.valueDesc && (
            <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, ml: 4.5 }}>
              {props.valueDesc}
            </Typography>
          )}
        </Box>
      </Box>
      {props.desc && <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>{props.value}</Typography>}
      {props.description && (
        <Typography sx={{ fontSize: 12, color: '#FF943E', background: '#FFF6F0', px: 1 }}>
          {props.description}
        </Typography>
      )}
    </Box>
  )

  return (
    <Grid container spacing={6}>
      <Grid item xl={6} md={6} sm={12} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='签署平台协议'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background3,
                    borderRadius: 2,
                    px: 5,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Icon icon='mdi:file-document-box-outline' width={24} color={theme.palette.info.dark} />
                    <Typography
                      sx={{
                        fontSize: 14,
                        ml: 3,
                        color: theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        mb: 0.5
                      }}
                    >
                      {'客户与平台的主服务协议'}
                    </Typography>
                  </Box>
                  <IconButton>
                    <Icon icon='material-symbols:download' width={24} color={theme.palette.info.dark} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background2,
                    borderRadius: 2,
                    px: 5,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3.5
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {'客户签署'}
                  </Typography>
                  <Box>
                    <Button variant='contained' sx={{ height: 38 }}>
                      审查并签署
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='签署合约'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background3,
                    borderRadius: 2,
                    px: 5,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Icon icon='mdi:file-document-box-outline' width={24} color={theme.palette.info.dark} />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        ml: 3
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: theme.palette.text.primary,
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          mb: 0.5
                        }}
                      >
                        {'EOR合同-前端工程师'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}>
                        {'这是客户与 TeleHire特聘 签订的员工工作范围协议'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <Icon icon='material-symbols:download' width={24} color={theme.palette.info.dark} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background2,
                    borderRadius: 2,
                    px: 5,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3.5
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {'客户签署'}
                  </Typography>
                  <Box>
                    <Button variant='outlined' sx={{ mr: 4, height: 38 }}>
                      拒绝
                    </Button>
                    <Button variant='contained' sx={{ height: 38 }} disabled>
                      审查并签署
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background3,
                    borderRadius: 2,
                    p: 4.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3.5
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {'平台方会签'}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {'未开始'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: theme.palette.text.primary, whiteSpace: 'nowrap' }}>
                  该EOR合同受已签订的《{' '}
                  <Typography variant='overline' sx={{ color: theme.palette.info.light, fontSize: 14 }}>
                    客户与平台的主服务协议
                  </Typography>{' '}
                  》的约束，请仔细阅读。
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='入职追踪器'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.background3,
                    borderRadius: 2,
                    p: 4.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, width: 154 }}>
                    {'期望开始工作的时间'}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>{'2023年 1月 13日'}</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      mt: 5,
                      mb: 6
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: '#303133', mb: 1, fontWeight: 500 }}>
                      {'入职清单'}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#606266' }}>{'0/4 项已完成'}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: theme.palette.info.main, mr: 0.5 }}>
                      {'了解截止日期'}
                    </Typography>
                    <Icon icon='material-symbols:arrow-outward' width={20} color={theme.palette.info.main} />
                  </Box>
                </Box>

                <Box>
                  <Stepper orientation='vertical'>
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Icon icon='material-symbols:circle-outline' width={20} color={theme.palette.divider} />
                        )}
                        sx={{
                          '.MuiStepLabel-labelContainer': {
                            background: theme.palette.customColors.background2,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            ml: 1.5
                          },
                          '.MuiStepLabel-label': {
                            color: theme.palette.text.primary,
                            fontSize: 14,
                            fontWeight: 500
                          }
                        }}
                        optional={<Typography variant='caption'>未开始</Typography>}
                      >
                        {t('通过邮箱邀请员工')}
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Icon icon='material-symbols:circle-outline' width={20} color={theme.palette.divider} />
                        )}
                        sx={{
                          '.MuiStepLabel-labelContainer': {
                            background: theme.palette.customColors.background2,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            ml: 1.5
                          },
                          '.MuiStepLabel-label': {
                            color: theme.palette.text.primary,
                            fontSize: 14,
                            fontWeight: 500
                          }
                        }}
                        optional={<Typography variant='caption'>未开始</Typography>}
                      >
                        {t('员工完成 TeleHire 平台注册 ')}
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Icon icon='material-symbols:circle-outline' width={20} color={theme.palette.divider} />
                        )}
                        sx={{
                          '.MuiStepLabel-labelContainer': {
                            background: theme.palette.customColors.background2,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            ml: 1.5
                          },
                          '.MuiStepLabel-label': {
                            color: theme.palette.text.primary,
                            fontSize: 14,
                            fontWeight: 500
                          }
                        }}
                        optional={<Typography variant='caption'>未开始</Typography>}
                      >
                        {t('员工提交个人合规性的信息')}
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Icon icon='material-symbols:circle-outline' width={20} color={theme.palette.divider} />
                        )}
                        sx={{
                          '.MuiStepLabel-labelContainer': {
                            background: theme.palette.customColors.background2,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            ml: 1.5
                          },
                          '.MuiStepLabel-label': {
                            color: theme.palette.text.primary,
                            fontSize: 14,
                            fontWeight: 500
                          }
                        }}
                        optional={<Typography variant='caption'>未开始</Typography>}
                      >
                        {t('员工签署员工协议')}
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xl={6} md={6} sm={12} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='报价概览'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
                action={
                  <Button variant='outlined' sx={{ height: 30 }}>
                    {t('下载报价')}
                  </Button>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('第一个月工资单')} />
                  <Cell title={t('总计')} value={t('2,974.41 美元')} />
                  <Cell title={t('工资总额')} value={t('$ 1209.67')} />
                  <Cell title={t('雇主成本')} value={t('$ 578.42')} showIcon />
                  <Cell title={t('平台费')} value={t('$ 599.00')} desc={t('每月 599 美元') || ''} />
                </Box>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('估计一般月薪')} />
                  <Cell title={t('总计')} value={t('6909.01 美元')} />
                  <Cell title={t('工资总额')} value={t('$ 1209.67')} />
                  <Cell title={t('雇主成本')} value={t('$ 578.42')} showIcon />
                  <Cell title={t('平台费')} value={t('$ 599.00')} desc={t('每月 599 美元') || ''} />
                </Box>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('签约奖金')} description={t('这将在第一个月的工资单上支付') || ''} />
                  <Cell title={t('总计')} value={t('6909.01 美元')} />
                  <Cell title={t('总签约奖金')} value={t('$ 1209.67')} />
                  <Cell title={t('雇主成本')} value={t('$ 578.42')} showIcon />
                </Box>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('预付押金')} description={t('这个要在签订合同后支付') || ''} />
                  <Cell title={t('总计')} value={t('12,318.01 美元')} />
                  <Cell title={t('押金')} value={t('$ 12,318.01')} description={t('预付1.5个月的费用') || ''} />
                </Box>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('应计遣散费')} />
                  <Cell title={t('总计')} value={t('0 美元')} />
                </Box>
                <Box
                  sx={{
                    mb: 9
                  }}
                >
                  <Title title={t('可变薪酬')} />
                  <Cell title={t('年度可变薪酬')} value={t('1000 美元')} valueDesc={t('固定金额') || ''} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Overview
