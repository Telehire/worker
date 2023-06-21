// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** View Imports
import Steps from 'src/views/contract/create/Steps'
import Step1 from 'src/views/contract/create/Step1'
import Step2 from 'src/views/contract/create/Step2'
import Step3 from 'src/views/contract/create/Step3'
import Step4 from 'src/views/contract/create/Step4'
import Step5 from 'src/views/contract/create/step5'
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

// ** Styled Components
const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

let loading = false

const ContractCreateFullTime = () => {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState(1)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const theme = useTheme()

  // ** Hooks
  const router = useRouter()
  const {currentContract} = useSelector((state: RootState) => state.contract)
  const { orgId } = useSelector((state: RootState) => state.org)

  //TODO

  const dispatch = useDispatch<AppDispatch>()
  const { contractId } = useSelector((state: RootState) => state.contract)
  const { staff } = currentContract || {}
  const { staffWorkplaceCountry } = staff || {}
  useEffect( () => {
    if(orgId) {
      if(router.query.type && String(router.query.type) === 'detail') {
        setStep(5)
      }
      if(router.query.contractId) {
        getContractDetail(String(router.query.contractId))
      }else {
        dispatch(fetchContractId({ orgId }))
      }
      if(router.query.type === 'edit') {
        setIsEdit(true)
      }
    }
  }, [router, orgId])

  useEffect(() => {
    return () => {dispatch(saveContractDetail({}))}
  }, [])

  useEffect(() => {
    loading = false
  }, [step])


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
          rkey: staffWorkplaceCountry
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

  const afterCreateTeam = async () => {
    await dispatch(fetchAllTeam({orgId}))
  }

  const setNextStep = (value: any) => {
    if(!loading) {
      loading = true
      setStep(value(step))
    }
  }


  const handleBack = () => {
    if (step === 1) {
      router.replace('/contract/create')
    } else {
      setStep(step - 1)
    }
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item md={8} sm={12}>
        <Steps step={step - 1} />
      </Grid>
      <Grid item md={6} sm={12}>
        <Stack>
          {
            step < 5 && <Box sx={{ mt: 10, position: 'relative' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: -3,
                  left: 0
                }}
              >
                <Box onClick={handleBack}>
                  <Fab
                    aria-label='back'
                    sx={{ backgroundColor: common.white, width: '28px', height: '28px', minHeight: '28px' }}
                  >
                    <Icon icon='material-symbols:arrow-back' />
                  </Fab>
                </Box>

                <TypographyStyled
                  variant='body2'
                  sx={{
                    mt: 2,
                    ml: 2,
                    color: theme.palette.secondary.light,
                    [theme.breakpoints.down(380)]: { display: 'none' }
                  }}
                >
                  {t('Register.Back')}
                </TypographyStyled>
              </Box>
            </Box>
          }

          <Typography variant='h5' textAlign='center'>
            {t('Staff.Create_contract')}
          </Typography>

          {step === 1 ? <Step1 setStep={setNextStep} orgId={orgId} contractId={contractId}  /> : null}
          {step === 2 ? <Step2 setStep={setNextStep} orgId={orgId} contractId={contractId} afterCreateTeam={afterCreateTeam} /> : null}
          {step === 3 ? <Step3 setStep={setNextStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 4 ? <Step4 setStep={setNextStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 5 ? <Step5 setStep={setNextStep} orgId={orgId} contractId={contractId} currentStep={step} /> : null}
          {step === 6 ? <Step5 setStep={setNextStep} orgId={orgId} contractId={contractId} currentStep={step} /> : null}
        </Stack>
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
