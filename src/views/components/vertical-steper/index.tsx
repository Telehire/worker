// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

interface Props {
  step: number,
  steps: {title: string}[]
}


const FormStep = ({ step, steps}: Props) => {
  const { t } = useTranslation()

  // const steps = [
  //   {
  //     title: t('Staff.Employee_info')
  //   },
  //   {
  //     title: t('Staff.Job')
  //   },
  //   {
  //     title: t('Staff.Salary')
  //   },
  //   {
  //     title: t('Staff.Attachment')
  //   }
  // ]
  return (
    <StepperWrapper sx={{ my: 5 }}>
      <Stepper activeStep={step} orientation="vertical">
        {steps.map(item => (
          <Step key={item.title}>
            <StepLabel>
              <div className='step-label'>
                <Typography className='step-title'>{item.title}</Typography>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </StepperWrapper>
  )
}

export default FormStep
