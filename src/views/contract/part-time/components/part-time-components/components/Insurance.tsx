// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

import { common } from '@mui/material/colors'
import Icon from '@/@core/components/icon'

import IconButton from '@mui/material/IconButton'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface IProps {
  onClose: () => void
  show: boolean,
  insuranceCompanies: any,
  changeSupplier: any,
  insuranceProducts: any,
  onSure: any
}

interface FormInputs {
  insurance: string,
  accident: string
}

export const Insurance = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onClose,onSure, show, insuranceCompanies, changeSupplier,insuranceProducts } = props
  const defaultValues = {
    insurance: '',
    accident: ''
  }

  const schema = yup.object().shape({
    insurance: yup.string().min(2).required(),
    accident: yup.string().min(2).required(),
  })
  const [productId, setProductId] = useState('')

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if(name === 'insurance'){
        changeSupplier(getValues('insurance'))
      }
      if(name === 'accident'){
        setProductId(getValues('accident'))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])


  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullWidth
      sx={{
        '.MuiPaper-root': {
          width: { xs: '100%', md: 600 },
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 6,
          width: 600
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
          }}
        >
          <Box>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            {t('添加医疗商业保险')}
          </Typography>
          <IconButton
            size='small' onClick={onClose}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Box
          sx={{
            mb: 6
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 3 }}>
            {t('选择供应商')}
          </Typography>
          <FormControl fullWidth>
              <InputLabel error={Boolean(errors.insurance)} htmlFor='insurance'>
                {t('选择保险')}
              </InputLabel>
              <Controller
                name='insurance'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('选择保险')}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.insurance)}
                    aria-describedby='insurance'
                  >
                    {
                      insuranceCompanies.map((company: any)=>(
                        <MenuItem value={company.supplierId}>{ company.name }</MenuItem>
                      ))
                    }
                  </Select>
                )}
              />
              {errors.insurance && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.insurance.message}</FormHelperText>
              )}
            </FormControl>
        </Box>

        <Box
          sx={{
            mb: 6
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, }}>
            {t('选择商业保险计划')}
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 3 }}>
            {t('按照员工实际情况选择适当的保险计划')}
          </Typography>
          <FormControl fullWidth>
            <InputLabel error={Boolean(errors.accident)} htmlFor='scheduleOfBelong'>
              {t('选择商业保险计划')}
            </InputLabel>
            <Controller
              name='accident'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('选择商业保险计划')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.accident)}
                  aria-describedby='accident'
                >
                  {
                    insuranceProducts.map((product:any)=>(
                      <MenuItem value={product.productId}>{product.productName}</MenuItem>
                    ))
                  }
                </Select>
              )}
            />
            {errors.accident && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.accident.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 3,
            background: theme.palette.customColors.background3,
            borderRadius: 2,
            mb: 4.25
          }}
        >
          <Typography sx={{ fontSize: 12, color: theme.palette.info.dark }}>
            {t('选择商业保险计划')}
          </Typography>
          <IconButton
            size='small'
            sx={{ color: theme.palette.info.dark }}
          >
            <Icon icon='material-symbols:download' width={24}/>
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 4,
            py: 2.25,
            background: theme.palette.customColors.background3,
            borderRadius: 2,
            mb: 2.5
          }}
        >
          <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, width: 80, mr: 9 }}>
            {t('平台服务费')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>
            {t('平台服务费')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 4,
            py: 2.25,
            background: theme.palette.customColors.background3,
            borderRadius: 2,
            mb: 8
          }}
        >
          <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary, width: 80, mr: 9 }}>
            {t('缴纳周期')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>
            {t('每月')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant='outlined' onClick={onClose}>{t('取消')}</Button>
          <Button variant='contained' onClick={ ()=> onSure(productId)} sx={{ ml: 3 }}>{t('确定')}</Button>
        </Box>
      </Box>
    </Dialog>
  )
}
