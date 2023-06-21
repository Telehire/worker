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
import Checkbox from '@mui/material/Checkbox'
import { ReactNode } from 'react'

const Detail = () => {
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

  const Cell = (props: { title: string; value: string; valueDesc?: string; desc?: string; icon?: ReactNode }) => (
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
        <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, width: 80, mr: 6 }}>
          {props.title}
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
      {props.icon && props.icon}
    </Box>
  )

  return (
    <Grid container spacing={6}>
      <Grid item xl={6} md={6} sm={12} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='协议详情'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box>
                  <Cell title={t('开始日期')} value={t('2023年 02月 28日')} />
                  <Cell title={t('职称')} value={t('前端工程师')} />
                  <Cell title={t('Employment Type')} value={t('Full-time')} valueDesc={t('每周 40.00 小时') || ''} />
                  <Cell title={t('Paid Vacation')} value={t('Standard')} valueDesc={t('5 天带薪年假') || ''} />
                  <Cell title={t('Probationary period')} value={t('90天')} />
                  <Cell title={t('归属实体')} value={t('台湾数银科技')} />
                  <Cell
                    title={t('归属团队')}
                    value={t('技术团队')}
                    icon={
                      <IconButton>
                        <Icon icon='material-symbols:edit' width={16} color={theme.palette.info.main} />
                      </IconButton>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='员工信息'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box>
                  <Cell title={t('法定全名')} value={t('王学兵')} />
                  <Cell
                    title={t('电子邮箱')}
                    value={t('wangxuebing@soke.cn')}
                    icon={
                      <IconButton>
                        <Icon icon='material-symbols:edit' width={16} color={theme.palette.info.main} />
                      </IconButton>
                    }
                  />
                  <Cell title={t('国籍')} value={t('中国')} />
                  <Cell title={t('就业国家')} value={t('中国')} />
                  <Cell title={t('工作签证')} value={t('不需要')} />
                  <Cell title={t('工作资格文件')} value={t('未上传')} />
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
                title='薪酬明细'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box>
                  <Cell title={t('每月固定工资')} value={t('5,000 美元')} />
                  <Cell title={t('总签约奖金')} value={t('3,000 美元')} />
                  <Cell title={t('雇主成本')} value={t('$ 578.42')} />
                  <Cell title={t('年度可变薪酬')} value={t('1,000 美元')} valueDesc={t('固定金额') || ''} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='工作范围说明'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
              />
              <CardContent>
                <Box sx={{ whiteSpace: 'wrap', color: theme.palette.text.secondary, fontSize: 12 }}>
                  通用客户主管在许多领域工作，通过寻找潜在客户、完成销售、支持现有客户、制定销售策略以及向客户传达产品价值来帮助公司发展。他们还负责管理客户簿并主动联系以确保客户满意度/保留率，同时不断寻找和关闭新业务。职责和责任
                  - 制定旨在实现预定目标和配额的详细业务计划 - 管理从寻找客户到达成交易的整个销售周期 -
                  通过网络发掘新的销售机会并将其转变为长期合作伙伴关系 - 向潜在客户展示产品-
                  提供专业的售后支持以最大限度地提高客户忠诚度 - 与客户保持定期联系以了解并满足他们的需求 -
                  回应投诉并解决问题以使客户满意并维护公司声誉 - 谈判协议 -
                  维护所有销售数据库报告销售活动和客户信息所必需的。- 参加管理层要求的所有销售会议和培训课程。
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='合同结束'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
                action={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: theme.palette.info.main, mr: 0.5 }}>
                      {t('如何终止全职合同')}
                    </Typography>
                    <Icon icon='material-symbols:arrow-outward' width={20} color={theme.palette.info.main} />
                  </Box>
                }
              />
              <CardContent>
                <Box>
                  <Cell title={t('结束日期')} value={t('无期限')} />
                  <Cell title={t('Probationary period')} value={t('90天')} />
                  <Cell title={t('试用期最后一天')} value={t('2023 年 4 月 22 日')} />
                  <Cell
                    title={t('取消合同')}
                    value={t('')}
                    icon={
                      <Button variant='outlined' sx={{ color: theme.palette.error.main, height: 30 }}>
                        {t('取消合同')}
                      </Button>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='Background Check'
                subheader='Verify the background of new team members and get results within minutes.'
                titleTypographyProps={{ sx: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 } }}
                avatar={
                  <IconButton sx={{ background: '#ECF5FF' }}>
                    <Icon icon='mdi:clipboard-text-search' width={42} color='#97CBFF' />
                  </IconButton>
                }
              />
              <CardContent>
                <Box
                  sx={{
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
                    <Checkbox />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        ml: 2.25
                      }}
                    >
                      <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, mb: 1.25 }}>
                        美国犯罪记录
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: theme.palette.info.main, mr: 0.5 }}>
                          {t('了解更多')}
                        </Typography>
                        <Icon icon='material-symbols:arrow-outward' width={20} color={theme.palette.info.main} />
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, fontWeight: 500 }}>
                    $ 49.00
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Detail
