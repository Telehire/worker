// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

interface Props {
  step: number
}

const Steps = ({ step }: Props) => {
  const { t } = useTranslation()

  const steps = [
    {
      title: t('个人信息')
    },
    {
      title: t('分配团队')
    },
    {
      title: t('选择角色')
    },
    {
      title: t('总结')
    }
  ]

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper orientation='vertical' activeStep={step}>
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
      </CardContent>
    </Card>
  )
}

export default Steps
