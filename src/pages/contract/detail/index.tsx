// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** View Imports
import Step6 from 'src/views/contract/create/step6'
import Box from '@mui/material/Box'
import { Fab } from '@mui/material'
import { common } from '@mui/material/colors'
import Icon from '../../../@core/components/icon'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {fetchContractId, saveContractDetail, setContractId} from 'src/store/apps/contract'
import { GET_CONTRACT_DETAIL } from 'src/apis/contract'
import axios from "axios";
import {fetchConfigByLng, setConfig} from "@/store/apps/config";
import {fetchAllOrg, fetchAllTeam} from "@/store/apps/org";
import {GET_CONFIG_WITH_LNG} from "@/apis";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomAvatar from "@/@core/components/mui/avatar";
import {cusFormatDate} from "@/@core/utils/format";

// ** Styled Components

const TypographyStyled2 = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 400,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))


const statusMap: any = {
  'TERMINATION': '已终止',
  'PENDING-ENTRY': '待员工入职',
  'ENTRY': '已生效'
}


const ContractCreateFullTime = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [tabKey, setTabkey] = useState<any>('Contract')

  // ** Hooks
  const router = useRouter()
  const {currentContract} = useSelector((state: RootState) => state.contract)
  const { orgId, teams } = useSelector((state: RootState) => state.org)

  //TODO

  const dispatch = useDispatch<AppDispatch>()
  const { contractId } = useSelector((state: RootState) => state.contract)

  useEffect( () => {
    if(orgId) {
      if(router.query.contractId) {
        getContractDetail(String(router.query.contractId))
      }
    }
  }, [router, orgId])



  const getContractDetail = async (contractId: string) => {
    await axios.get(GET_CONTRACT_DETAIL, {params: {orgId, contractId}}).then(async (res) => {
      console.log(res.data.data);
      const tempContract = {...res.data.data};
      tempContract.staff = Object.keys(res.data.data).reduce((fin: any, v: string)=> {
        if(v.indexOf('staff')>-1) {
          fin[v] = res.data.data[v]
        }
        return fin
      }, {})
      await dispatch(saveContractDetail({...tempContract}))

      await axios.get(GET_CONFIG_WITH_LNG, {params: {
          rgroup: 'full-time.weekly.working.hours',
          rkey: i18n.language.startsWith('zh_') ? i18n.language.replace('zh_', '') : i18n.language.toUpperCase()
        }}).then(res => {
        if(res.data.code === 'SUCCESS') {
          dispatch(setConfig({
            workingHour: res.data.data,
          }))
        }
      })
      await dispatch(fetchAllOrg({orgId}))
      await dispatch(fetchAllTeam({orgId}))
      await dispatch(setContractId(contractId))
    })
  }



  const findName = (id: any, arr: any, key?: string, label?: string) => {
    return (arr.find((v: any) => v[key || 'areaCode'] === id) as any || {} as any)[label || 'name']
  }

  const formItem = (title: string, val?: string) => (
    <Grid item sx={{display: 'flex' ,alignItems: 'center', mr: 9}}>
      <Typography sx={{color: '#909399', fontSize: 12, fontWeight: 400, mr: 1}}>{`${title}：`}</Typography>
      <Typography sx={{color: '#606266', fontSize: 12, fontWeight: 400, }}>{val}</Typography>
    </Grid>
  )


  return (
    <Grid container justifyContent='center'>
      <Grid item md={12} sm={12}>
        <Grid container md={12} sx={{borderRadius: 1,pt: 15, backgroundColor: '#D4C8EC', mb: 4, overflow: 'hidden'}}>
          <Grid item xs={12} sx={{borderRadius: '8px 8px 0 0 ', display: 'flex', alignItems: 'flex-end', width: '100%', backgroundColor: '#fff'}}>
            <CustomAvatar src={`/images/avatars/${currentContract.contractId}`} sx={{ mr: 4, width: 72, height: 72 , mt: -36, ml: 6}} />
            <TypographyStyled2 sx={{textAlign: 'left', mb: 1, fontSize: 24, fontWeight: 500, mr: 4}}>{currentContract.staffName}</TypographyStyled2>
            <Typography sx={{color: '#206AB5', fontSize: 14, fontWeight: 400, py: 1, px: 2, backgroundColor: '#ECF5FF', mb: 1}}>{statusMap[currentContract.contractStatus]}</Typography>
          </Grid>
          <Grid item xs={12}  sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#fff', pl: 6,py: 6}}>
            {formItem('职称', currentContract.jobTitle)}
            {formItem('合同类型', currentContract.contractType === 'EOR' ? '全职合同' : '固定费用合同')}
            {formItem('团队', findName(currentContract.teamId, teams, 'teamId', 'teamName'))}
            {formItem('创建时间', cusFormatDate(new Date(currentContract.gmtCreate)))}
            {formItem('创建人', 'admin')}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tabs value={tabKey} onChange={(e, val) => setTabkey(val)}>
            <Tab value="Contract" label='合同' />
            <Tab value="Invoice" label='账单' />
          </Tabs>
        </Grid>
        {
          tabKey === 'Contract' &&  <Step6 orgId={orgId} contractId={contractId} getContractDetail={getContractDetail}/>
        }
      </Grid>
    </Grid>
  )
}

/*ContractCreateFullTime.setConfig = () => {
  return {
    appBar: 'hidden'
  }
}*/

export default ContractCreateFullTime
