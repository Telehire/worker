// ** MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import { useState, useEffect } from 'react'

// ** View Imports
import BillsToBePaid from 'src/views/dashboards/BillsToBePaid'
import ContractsToBeSigned from 'src/views/dashboards/ContractsToBeSigned'
import ContractsOnGoing from 'src/views/dashboards/ContractsOnGoing'
import GlobalTeams from 'src/views/dashboards/GlobalTeams'
import WeeklyPaid from 'src/views/dashboards/WeeklyPaid'
import BeginnerGuide from 'src/views/dashboards/BeginnerGuide'
import Announcement from 'src/views/dashboards/Announcement'
import Resources from 'src/views/dashboards/Resources'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import LoginPage from '../auth/login'
import Home from '../home'
import { GET_CURRENT_USER_ORG_LIST, GET_ORG_ENTITY_LIST } from '@/apis'
import axios from 'axios'

const Dashboard = () => {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const router = useRouter()
  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
  }
  useEffect(() => {
    axios.get(GET_CURRENT_USER_ORG_LIST, {}).then(async res => {
      if (res.data.code === 'SUCCESS') {
        await axios.get(GET_ORG_ENTITY_LIST, { params: { orgId: res.data.data[0].orgId } }).then(res1 => {
          if (!res1.data.data.length || !res1.data.data.some((v: any) => v.kycStatus === 3 || v.kycStatus === 5)) {
            // setShowEditDialog(true)
          }
        })
      }
    })
  }, [])
  const handleToKyc = () => {
    router.push('/enterprise/certification/')
  }
  return (
    <Grid container spacing={6} color='#303133'>
      <Grid item xs={12} md={8}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <BillsToBePaid />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ContractsToBeSigned />
          </Grid>
          <Grid item xs={12}>
            <ContractsOnGoing />
          </Grid>
          <Grid item xs={12} md={6}>
            <GlobalTeams />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklyPaid />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <BeginnerGuide />
          </Grid>
          <Grid item xs={12}>
            <Announcement />
          </Grid>
          <Grid item xs={12}>
            <Resources />
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={showEditDialog}
        onClose={handleCloseEditDialog}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 450 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: { xs: '100%', md: '40%' },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        <Grid
          container
          md={12}
          sm={12}
          sx={{
            py: 10,
            px: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box component='img' src='/images/organization/tips-back.png' width={240} sx={{ mb: 10 }} />
          <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 5, textAlign: 'center' }}>
            请先完善组织认证信息
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A354199', mb: 5, textAlign: 'center' }}>
            请先完善组织详细信息后，才能使用 TeleHire 的相关功能
          </Typography>
          <Button
            size='large'
            variant='contained'
            onClick={() => {
              handleToKyc()
            }}
          >
            认证企业信息
          </Button>
        </Grid>
      </Dialog>
    </Grid>
  )
}

export default Dashboard
