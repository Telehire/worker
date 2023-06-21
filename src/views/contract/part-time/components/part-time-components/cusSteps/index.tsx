// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// ** Styled Components
import StepperWrapper from '@/@core/styles/mui/stepper'

interface Props {
  step: number
  steps: {title: string}[]
}

const FormStep = ({ step, steps }: Props) => {
  const { t } = useTranslation()

  return (
    <StepperWrapper sx={{ my: 5 }}>
      <Stepper activeStep={step}>
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
