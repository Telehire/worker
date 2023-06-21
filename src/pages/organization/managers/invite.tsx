// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// ** View Imports
import Header from 'src/views/organization/components/Header'
import Steps from 'src/views/organization/managers/InviteManager/Steps'
import Step1 from 'src/views/organization/managers/InviteManager/Step1'
import Step2 from 'src/views/organization/managers/InviteManager/Step2'
import Step3 from 'src/views/organization/managers/InviteManager/Step3'
import Step4 from 'src/views/organization/managers/InviteManager/Step4'

const Invite = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<Record<string, any>>({})

  return (
    <Box>
      <Header title={t('邀请经理')} backUrl='/organization/managers' />

      <Grid container spacing={6}>
        <Grid item sm={2} xs={12}>
          <Steps step={step - 1} />
        </Grid>

        <Grid item sm={10}>
          {step === 1 ? <Step1 setValues={setValues} setStep={setStep} /> : null}
          {step === 2 ? <Step2 setValues={setValues} setStep={setStep} /> : null}
          {step === 3 ? <Step3 setValues={setValues} setStep={setStep} /> : null}
          {step === 4 ? <Step4 values={values} setValues={setValues} setStep={setStep} /> : null}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Invite
