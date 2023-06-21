// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, SetStateAction, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface Props {
  values: Record<string, any>
  setValues: Dispatch<SetStateAction<Record<string, any>>>
  setStep: Dispatch<SetStateAction<number>>
}

const Step4 = ({ values, setValues, setStep }: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const onOk = () => {
    setOpen(true)
  }

  const onCancel = () => {
    setStep(prev => prev - 1)
  }

  const onFinish = () => {
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader title={t('总结')} />

      <CardContent>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{ height: 68, mb: 2, pl: 4, pr: 6, background: '#F4F5FA', borderRadius: 1 }}
        >
          <Box>
            <Typography noWrap variant='subtitle1' color='#303133'>
              {values.managerName}
            </Typography>
            <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
              {values.managerEmail}
            </Typography>
          </Box>
          <Typography noWrap variant='subtitle1' color='#303133'>
            {values.teams?.length}
            {t('个团队')}
          </Typography>
        </Stack>

        <Box sx={{ marginBottom: 8 }}>
          {(values.teams || []).map((item: any) => (
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ height: 68, mt: 4, mb: 2, pl: 4, pr: 6, background: '#F4F5FA', borderRadius: 1 }}
            >
              <Stack direction='row' alignItems='center'>
                <CustomAvatar src={`/images/avatars/${item.id}`} sx={{ ml: 2, mr: 2, width: '2rem', height: '2rem' }} />
                <Typography noWrap variant='subtitle1' color='#303133'>
                  {item.name}
                </Typography>
              </Stack>

              <Stack direction='row' alignItems='center'>
                <Box sx={{ mr: 5 }}>
                  <Typography noWrap variant='subtitle1' color='#303133' textAlign='right'>
                    {item.roleName}
                  </Typography>
                  <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
                    {item.canApprove || item.canControl ? t('附加权限：') : ''}
                    {item.canApprove ? t('审批人') : ''}
                    {item.canApprove && item.canControl ? '、' : ''}
                    {item.canControl ? t('控制器') : ''}
                  </Typography>
                </Box>

                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <g clipPath='url(#clip0_729_9164)'>
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M9.46436 15.7142C9.46436 15.4183 9.7042 15.1785 10.0001 15.1785H16.4286C16.7245 15.1785 16.9644 15.4183 16.9644 15.7142C16.9644 16.01 16.7245 16.2499 16.4286 16.2499H10.0001C9.7042 16.2499 9.46436 16.01 9.46436 15.7142Z'
                      fill='#3A3541'
                      fillOpacity='0.6'
                    />
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M14.2857 4.0204C14.0259 4.0204 13.7767 4.1236 13.593 4.3073L4.76939 13.1309L4.30764 14.9779L6.15463 14.5162L14.9783 5.69254C15.0692 5.60158 15.1414 5.4936 15.1906 5.37476C15.2398 5.25592 15.2652 5.12855 15.2652 4.99992C15.2652 4.87129 15.2398 4.74391 15.1906 4.62507C15.1414 4.50623 15.0692 4.39825 14.9783 4.3073C14.8873 4.21634 14.7793 4.14419 14.6605 4.09496C14.5417 4.04574 14.4143 4.0204 14.2857 4.0204ZM12.8354 3.54968C13.22 3.16506 13.7417 2.94897 14.2857 2.94897C14.555 2.94897 14.8217 3.00202 15.0705 3.10509C15.3194 3.20816 15.5454 3.35923 15.7359 3.54968C15.9263 3.74013 16.0774 3.96622 16.1805 4.21506C16.2836 4.46389 16.3366 4.73058 16.3366 4.99992C16.3366 5.26925 16.2836 5.53595 16.1805 5.78478C16.0774 6.03361 15.9263 6.25971 15.7359 6.45015L6.80732 15.3787C6.73866 15.4474 6.65264 15.4961 6.55844 15.5196L3.7013 16.2339C3.51874 16.2796 3.32562 16.2261 3.19256 16.093C3.0595 15.96 3.00601 15.7668 3.05165 15.5843L3.76594 12.7271C3.78949 12.6329 3.83819 12.5469 3.90685 12.4783L12.8354 3.54968Z'
                      fill='#3A3541'
                      fillOpacity='0.6'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_729_9164'>
                      <rect width='20' height='20' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </Stack>
            </Stack>
          ))}
        </Box>

        <Grid item xs={12}>
          <Grid container justifyContent='flex-end'>
            <Button size='large' variant='outlined' onClick={onCancel}>
              {t('上一步')}
            </Button>

            <Button size='large' variant='contained' onClick={onOk} sx={{ ml: 3 }}>
              {t('完成邀请')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={open} onClose={onFinish}>
        <Stack alignItems='center' justifyContent='center' sx={{ width: 480, height: 320 }}>
          <Box component='img' src='/images/common/check-icon.png' sx={{ width: 108, mt: 6, mb: 6 }} />
          <Typography variant='h6'>
            {values.managerName} {t('已经被邀请成为经理')}
          </Typography>
          <Typography variant='body2' sx={{ mt: 2, mb: 5 }}>
            {t('TA将收到一封电子邮件，邮件内容是引导TA如何登录帐户')}
          </Typography>
          <Button variant='contained' onClick={onFinish}>
            {t('知道了')}
          </Button>
        </Stack>
      </Dialog>
    </Card>
  )
}

export default Step4
