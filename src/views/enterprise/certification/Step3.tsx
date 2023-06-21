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
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

import FileUploader from './components/FileUploader'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
}

interface FormInputs {
  certificate: string
}

const Step3 = ({ setStep }: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const defaultValues = {
    certificate: '1'
  }

  // const defaultValues = {
  //   certificate: '',
  // }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = () => {
    // setStep(prev => prev + 1)
    setOpen(true)
  }

  const onFinish = () => {
    setOpen(false)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ my: 5 }}>
          <CardHeader title={t('企业文件')} />

          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='certificate' error={Boolean(errors.certificate)} htmlFor='certificate'>
                    {t('注册证书/营业执照')}
                  </InputLabel>
                  <Controller
                    name='certificate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => <FileUploader />}
                  />
                  {errors.certificate && (
                    <FormHelperText sx={{ color: 'error.main' }} id='certificate'>
                      {t('This field is required')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid item xs={12}>
          <Button size='large' type='submit' variant='contained' sx={{ width: '100%' }}>
            {t('Complete')}
          </Button>
        </Grid>
      </form>

      <Dialog open={open} onClose={onFinish}>
        <Stack alignItems='center' justifyContent='center' sx={{ width: 400, height: 320 }}>
          <Box component='img' src='/images/enterprise/check-icon.png' sx={{ width: 48, mt: 5, mb: 10 }} />
          <Typography variant='h6'>{t('恭喜你，你已经完成企业认证信息')}</Typography>
          <Typography variant='body2' sx={{ mt: 2, mb: 5 }}>
            {t('实体名称：')}台湾数银实验室
          </Typography>
          <Button variant='contained' onClick={onFinish}>
            {t('知道了')}
          </Button>
        </Stack>
      </Dialog>
    </Box>
  )
}

export default Step3
