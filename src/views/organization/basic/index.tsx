// ** I18n Imports
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import Link from 'src/components/link'

// ** Page Components Imports
import Edit from './Edit'
import axios from "axios";
import {GET_ORG_ENTITY_LIST} from "@/apis";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

const Basic = () => {
  const { t } = useTranslation()
  const { orgId } = useSelector((state: RootState) => state.org)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [currentOrg, setCurrentOrg] = useState<any>({})
  const [showInfo, setShowInfo] = useState<boolean>(false)
  useEffect(() => {
    if(orgId) {
      getEntityList()
      getCurrentOrgInfo()
    }
  }, [orgId])
  const getEntityList = () => {
    axios.get(GET_ORG_ENTITY_LIST, {params: {orgId}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        let needAlert = true;
        let needInfo = false
        for(let i = 0; i < res.data.data.length;i++) {
          if(res.data.data[i].kycStatus === 5) {
            needAlert = false
          }else if(res.data.data[i].kycStatus === 3) {
            needAlert = false
            needInfo = true
            break;
          }
        }
        setShowAlert(needAlert)
        setShowInfo(needInfo)
      }
    })
  }
  const getCurrentOrgInfo = () => {
    const temp = localStorage.getItem('CURRENT_ORG_INFO') || '{}';
    setCurrentOrg(JSON.parse(temp))
  }

  return (
    <>
      {
        showAlert &&  <Alert severity='warning' sx={{ position: 'relative' }}>
          <AlertTitle>{t('未完成企业认证')}</AlertTitle>
          {t(
            '请先关联一个实体企业信息，在正式使用相关功能之前，我们会收集企业相关信息并完成验证，以保证合法性与安全性。'
          )}
          <Link
            href='/enterprise/certification/'
            sx={{
              position: 'absolute',
              right: 20,
              top: 32,
              fontSize: 14,
              fontWeight: 400,
              color: '#206AB5 !important'
            }}
          >
            {t('前往认证 →')}
          </Link>
        </Alert>
      }
      {
        showInfo && (
          <Alert severity='info' sx={{ position: 'relative' }}>
            {t(
              '您已成功提交企业认证申请，我们将在1-2天之内审核完成，审核结果会通过您的注册时填写的邮箱地址通知您'
            )}
          </Alert>
        )
      }

      <Card sx={{ width: '100%', my: 5 }}>
        <CardHeader
          title={t('组织详情')}
          subheader={t('您提供的有关您业务的信息越多，就越容易完全验证您的帐户。')}
          action={<Edit />}
        />
        <CardContent>
          <Grid container spacing={[4, 8]} alignItems='center'>
            <Grid item sm={2} xs={3}>
              {t('组织名称')}
            </Grid>
            <Grid item sm={10} xs={9}>
              <Typography variant='subtitle1' fontWeight='500'>
                {currentOrg.orgName}
              </Typography>
            </Grid>

            <Grid item sm={2} xs={3}>
              {t('组织logo')}
            </Grid>
            <Grid item sm={10} xs={9}>
              <Box component='img' src='/images/organization/nologo.png' sx={{ width: 48 }} />
            </Grid>

            <Grid item sm={2} xs={3}>
              {t('公司网址')}
            </Grid>
            <Grid item sm={10} xs={9}>
              <Typography variant='subtitle2'>{currentOrg.orgSite}</Typography>
            </Grid>

            <Grid item sm={2} xs={3}>
              {t('公司Linkedin')}
            </Grid>
            <Grid item sm={10} xs={9}>
              <Typography variant='subtitle2' fontWeight='500'>
                {currentOrg.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Basic
