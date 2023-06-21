// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const ButtonStyled = styled(Button)(() => ({
  padding: '4px 18px !important',
  fontSize: 14,
  color: '#7C4DFF',
  background: '#F1F0FF',
  borderColor: 'transparent',
  boxShadow: 'none'
}))

interface FormInputs {
  name: string,
  email: string,
  linkedin: string
}

const Edit = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const onShow = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const defaultValues = {
    name: '',
    email: '',
    linkedin: ''
  }

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues})

  const handleSubmit = () => {

  }

  return (
    <>
      <ButtonStyled variant='outlined' size='small' onClick={onShow}>
        {t('编辑')}
      </ButtonStyled>

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Typography variant='h6'>{t('组织详情')}</Typography>

          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ width: 480 }}>
          <form>
            <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
              <Controller
                name={'name'}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('组织名称')}
                    placeholder={t('组织名称') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    aria-describedby='name'
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ my: 3, px: 4, py: 2.5, background: '#F9FBFF' }}
            >
              <Box component='img' src='/images/organization/nologo.png' sx={{ width: 48 }} />
              <Button variant='outlined' size='small'>
                {t('上传 Logo')}
              </Button>
            </Stack>
            <Typography variant='body2' sx={{ fontSize: 12 }}>
              {t('您的组织logo将用于与独立承包商和员工的沟通，并有助于个性化您的体验。')}
            </Typography>

            <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
              <Controller
                name={'email'}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('公司网址')}
                    placeholder={t('公司网址') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    aria-describedby='email'
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
              <Controller
                name={'linkedin'}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('公司Linkedin')}
                    placeholder={t('公司Linkedin') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.linkedin)}
                    aria-describedby='linkedin'
                  />
                )}
              />
              {errors.linkedin && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.linkedin.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button size='large' variant='contained' sx={{ width: '100%', mt: 12 }} onClick={() => {handleSubmit()}}>
              {t('保存')}
            </Button>
          </form>

        </DialogContent>
      </Dialog>
    </>
  )
}

export default Edit
