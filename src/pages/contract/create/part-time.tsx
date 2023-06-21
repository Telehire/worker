// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** View Imports
import Steps from '../../../views/contract/part-time/components/part-time-components/cusSteps/index'
import Step1 from '../../../views/contract/part-time/components/part-time-components/Step1'
import Step2 from '../../../views/contract/part-time/components/part-time-components/Step2'
import Step3 from '../../../views/contract/part-time/components/part-time-components/Step3'
import Step4 from '../../../views/contract/part-time/components/part-time-components/Step4'
import Step5 from '../../../views/contract/part-time/components/part-time-components/Step5'
import Box from '@mui/material/Box'
import { Fab } from '@mui/material'
import { common } from '@mui/material/colors'
import Icon from '../../../@core/components/icon'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchContractId,
  getContractDetailById,
  getFixedCostContractDetailById,
  setContractId
} from 'src/store/apps/contract'
import {fetchCustomJobScope, fetchJobTitle} from "@/store/apps/job";
import {fetchAllOrg, fetchAllTeam} from "@/store/apps/org";

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

const ContractCreateFullTime = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const theme = useTheme()

  // ** Hooks
  const router = useRouter()

  const steps = [
    {
      title: t('Employee Information')
    },
    {
      title: t('Payment Details')
    },
    {
      title: t('Define Date')
    },
    {
      title: t('Compliance')
    },
    {
      title: t('Benefits and additional services')
    },
  ]

  //TODO
  const { orgId } = useSelector((state: RootState) => state.org)

  const dispatch = useDispatch<AppDispatch>()
  const { contractId } = useSelector((state: RootState) => state.contract)

  useEffect(() => {
    if(orgId) {
      console.log('重新获取')
      if(router.query.contractId) {
        dispatch(setContractId({contractId: String(router.query.contractId)}))
        dispatch(getFixedCostContractDetailById({orgId, contractId: String(router.query.contractId)}))
      } else {
        dispatch(fetchContractId({ orgId }))
      }
      dispatch(fetchJobTitle({}))
      dispatch(fetchCustomJobScope({ orgId }))
      dispatch(fetchAllOrg({orgId}))
      dispatch(fetchAllTeam({orgId}))
    }
  }, [orgId, router])

  const handleBack = () => {
    if (step === 1) {
      router.replace('/contract/create')
    } else {
      setStep(step - 1)
    }
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item md={6} sm={12}>
        <Stack>
          <Steps steps={steps} step={step - 1} />

          <Box sx={{ mt: 10, position: 'relative' }}>
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

          <Typography variant='h5' textAlign='center'>
            {t('创建固定费用合同')}
          </Typography>

          {step === 1 ? <Step1 setStep={setStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 2 ? <Step2 setStep={setStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 3 ? <Step3 setStep={setStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 4 ? <Step4 setStep={setStep} orgId={orgId} contractId={contractId} /> : null}
          {step === 5 ? <Step5 setStep={setStep} orgId={orgId} contractId={contractId} /> : null}
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
