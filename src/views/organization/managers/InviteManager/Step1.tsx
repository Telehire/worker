// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, SetStateAction } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

interface Props {
  setValues: Dispatch<SetStateAction<Record<string, any>>>
  setStep: Dispatch<SetStateAction<number>>
}

interface FormInputs {
  managerName: string
  managerEmail: string
}

const Step1 = ({ setValues, setStep }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const defaultValues = {
    managerName: '',
    managerEmail: ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = (values: FormInputs) => {
    setValues(values)
    setStep(prev => prev + 1)
  }

  const onCancel = () => {
    router.back()
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title={t('个人信息')} />

          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='managerName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('TA的姓名')}
                        placeholder={t('请输入') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.managerName)}
                        aria-describedby='managerName'
                      />
                    )}
                  />
                  {errors.managerName && (
                    <FormHelperText sx={{ color: 'error.main' }} id='managerName'>
                      {t('This field is required')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='managerEmail'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        label={t('TA的电子邮箱')}
                        placeholder={t('请输入') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.managerEmail)}
                        aria-describedby='managerEmail'
                      />
                    )}
                  />
                  {errors.managerEmail && (
                    <FormHelperText sx={{ color: 'error.main' }} id='managerEmail'>
                      {t('This field is required')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent='flex-end'>
                  <Button size='large' variant='outlined' onClick={onCancel}>
                    {t('取消')}
                  </Button>

                  <Button size='large' type='submit' variant='contained' sx={{ ml: 3 }}>
                    {t('继续')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default Step1
