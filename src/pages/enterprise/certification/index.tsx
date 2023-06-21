// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

// ** View Imports
import Steps from 'src/views/enterprise/certification/Steps'
import Step1 from 'src/views/enterprise/certification/Step1'
import Step2 from 'src/views/enterprise/certification/Step2'
import Step3 from 'src/views/enterprise/certification/Step3'
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const EnterpriseCertification = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [entityId, setEntityId] = useState<string>('')
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const router = useRouter()
  const [steps, setSteps] = useState<{title: string}[]>([
    {
      title: t('企业信息')
    },
    {
      title: t('法人信息')
    },
  ])
  const handleDialogSure = () => {
    setShowDialog(false);
    router.push('/organization/basic')
  }

  const handleChangePlace = (place: string) => {
    const tempSteps = steps.slice(0, 1);
    switch (place) {
      case 'CN':
        setSteps([...tempSteps, {title: t('法人信息')}])
        break;
      case 'TW':
        setSteps([...tempSteps, {title: t('注册地址')}])
        break;

    }
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item md={6} sm={12}>
        <Stack>
          <Typography variant='h5' textAlign='center'>
            {t('完善企业认证信息')}
          </Typography>

          <Steps step={step - 1} steps={steps} />

          {step === 1 ? <Step1 setStep={setStep} setEntityId={setEntityId} handleChangePlace={handleChangePlace} /> : null}
          {step === 2 ? <Step2 setStep={setStep} entityId={entityId} setShowDialog={setShowDialog} /> : null}
          {/*{step === 3 ? <Step3 setStep={setStep} /> : null}*/}
        </Stack>
      </Grid>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
        fullWidth
        sx={{
          '.MuiPaper-root': {
            maxWidth: 'fit-content',
            width: { xs: '100%', md: 480 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8.5 }}>
          <Box component='img' src='/images/bill/create-bill.png' width={96}></Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 2, mt: 8 }}>
            恭喜你！您已成功提交企业认证申请
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#606266', mb: 5 }}>
            我们预计需要1-2天的时间来审核您的资料
          </Typography>
          <Box>
            <Button size='large' type='submit' variant='contained' onClick={() => {handleDialogSure()}} style={{}}>
              {t('知道了')}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Grid>
  )
}

EnterpriseCertification.setConfig = () => {
  return {
    appBar: 'hidden'
  }
}

export default EnterpriseCertification
