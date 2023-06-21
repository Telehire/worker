// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import {ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { common } from '@mui/material/colors'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import Icon from "@/@core/components/icon";

interface Contract {
  id: string
  name: string
  teamName: string
  startTime: string
  endTime: string
  createTime: string
  type: string
  status: string
}

const statusMap = {
  'DRAFT': '草稿',
}

const durationMap: any = {
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
}
const pageSizeList = [10, 20, 50, 100];

interface IParams {
  status: string[],
  type: string[],
  date: any
}

interface EntityProps {
  entiryCountry: string;
  entiryEnName: string;
  entiryId: string;
  entiryName: string;
  kycStatus: number;
  orgId: string;
  status: number;
}

interface CurrencyProps {
  countryCode: string;
  countryName: string;
  currencyId: string;
  currencyName: string;
  currencySymbol: string;
  currencyUnit: string;
  lng: string;
}

interface TeamProps {
  creator: string;
  founderId: string;
  gmtCreate?: any;
  gmtModified?: any;
  id: number;
  modifier: string;
  orgId: string;
  orgName: string;
  role: string;
  status: number;
  teamId: string
  teamName: string;
}

interface FormInputs {
  orgId: string,
  bizEntityId: string,
  certificateType: string,
  name: string,
  idNumber: string,
  startDate: any,
  endDate: any,
  isPermanent: string,
}


const TabsType: any =  {
  app: 'App',
  connect: 'Connect',
}

const tagArr: string[] = [
  '所有', '费用管理', '全球薪资', '人力资源', '会计', '用户管理'
]
const appList: any[] = [
  [
    {
      url: '/images/organization/openApi/icon1.png',
      title: 'Ashby',
      desc: '为高增长公司构建人员结构的应用',
      content: '类别：费用管理、人力资源',
      free: '免费'
    },
    {
      url: '/images/organization/openApi/icon2.png',
      title: 'BambooHR',
      desc: 'BambooHR® 绩效管理以员工为中心',
      content: '类别：人力资源',
      free: '免费',
    }
  ],
  [
    {
      url: '/images/organization/openApi/icon3.png',
      title: 'Google Workspace',
      desc: '在 Google Workspace 中自动创建和管理用户',
      content: '类别：人力资源',
      free: '免费',
    },
    {
      url: '/images/organization/openApi/icon4.png',
      title: 'Hibob',
      desc: 'bob 是一种人力资源管理 (HRM) 解决方案，旨在改善员工人数超过 50 人的公司的员工体验和生命周期',
      content: '类别：人力资源',
      free: '免费',
    }
  ],
  [
    {
      url: '/images/organization/openApi/icon5.png',
      title: 'Greenhouse',
      desc: '我们不仅仅是 ATS，还帮助企业提供可衡量的招聘结果，以便他们可以为下一步建设、发展和招聘',
      content: '类别：人力资源',
      free: '免费',
    },
    {
      url: '/images/organization/openApi/icon6.png',
      title: 'Xero',
      desc: 'Xero 的在线会计软件可帮助小型企业节省时间。TeleHire自动将您的团队成本数据与 Xero 总账同步，以简化您的会计流程',
      content: '类别：会计',
      free: '免费',
    }
  ],
  [
    {
      url: '/images/organization/openApi/icon7.png',
      title: 'Workday',
      desc: 'Workday 是一种基于企业云的 HCM 工具',
      content: '类别：人力资源',
      free: '免费',
    },
    {
      url: '/images/organization/openApi/icon8.png',
      title: 'QuickBooks',
      desc: 'QuickBooks 是由 Intuit 开发和销售的会计软件包。 TeleHire与 它，自动将您的团队成本数据与Quickbooks 总账同步',
      content: '类别：费用管理、会计',
      free: '免费',
    }
  ]
]

const VacateList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [keyword, setKeyword] = useState<string>('')
  const [tabKey, setTabKey] = useState<string>('App')
  const { direction } = theme

  const defaultValues = {
    orgId: '',
    bizEntityId: '',
    certificateType: '1',
    name: '',
    idNumber: '',
    startDate: '',
    endDate: '',
    isPermanent: '',
  }
  const infoCard = ({url, title, desc, content, free}: {url: string, title: string, desc: string, content: string,free: string}) => {
    return (
      <Card sx={{mb: 5.5}}>
        <CardContent sx={{px: 5, py: 5}}>
          <Grid container sx={{display: 'flex', alignItems: 'center'}}>
            <Grid item sx={{width: 58, height: 58, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 22, backgroundColor: '#F4F5FA', mr: 5}}>
              <Box component="img" src={url} sx={{width: 50}} />
            </Grid>
            <Grid item sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
             <Grid sx={{display: 'flex', alignItems: 'center', mb: 2,}}>
               <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#3A3541DE', mr: 2 }}>
                 {title}
               </Typography>
               <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#8A8D93', backgroundColor: '#F4F5FA', borderRadius: 2, px: 2, py: 1 }}>
                 {free}
               </Typography>
             </Grid>
              <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#3A354199', height: 36 }}>
                {desc}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#3A354199' }}>
                {content}
              </Typography>
            </Grid>
          </Grid>
          <Grid sx={{textAlign: 'right',height: 40}}>
            <Button
              href='#'
              component={Link}
              variant='outlined'
              onClick={() => {}}
              endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
              style={{
                margin: 0
              }}
              sx={{
                borderRadius: 4,
                color: '#7C4DFF',
                backgroundColor: '#F4F5FA',
                my: 6,
                border: 0
              }}
            >
              {t('详情')}
            </Button>
          </Grid>
        </CardContent>
      </Card>
    )
  }


  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#3A3541DE',mb: 6 }}>
        开放平台
      </Typography>
      <Grid container xs={12} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={10}>
          <Tabs value={tabKey} onChange={(e, val) => setTabKey(val)}>
            <Tab value={TabsType.app} label="应用列表（56）" />
            <Tab value={TabsType.connect} label="已连接（8）" />
          </Tabs>
        </Grid>
      </Grid>
      {
        tabKey === TabsType.app && (
          <Grid item xs={12}>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', mb: 6}}>
              <TextField
                fullWidth
                size='small'
                value={keyword}
                label='搜索应用'
                placeholder='搜索应用'
                sx={{backgroundColor: '#fff'}}
                onChange={e => setKeyword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#fff', px: 4, py: 4, borderRadius: 1, mb: 8}}>
              {
                tagArr.map(v => (
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#3A3541DE', border: '1px solid #3A354166', px: 2, py: 1,borderRadius: 2, mr: 4}}>
                    {v}
                  </Typography>
                ))
              }
            </Grid>
            <Grid item xs={12} sx={{px: 4, py: 4, borderRadius: 1}}>
              {appList.map(v => (
                <Grid container>
                  <Grid xs={5.8}>
                    {infoCard(v[0])}
                  </Grid>
                  <Grid xs={0.4} />
                  <Grid xs={5.8}>
                    {infoCard(v[1])}
                  </Grid>
                </Grid>
              ))}
            </Grid>
            </Grid>
        )
      }

    </Box>
  )
}

export default VacateList
