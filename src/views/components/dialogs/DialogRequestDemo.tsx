// ** React Imports
import { Ref, useState, forwardRef, ReactElement, Fragment, MouseEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

import { useTranslation } from 'react-i18next'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Alert, Grid, InputLabel } from '@mui/material'
import { common } from '@mui/material/colors'
import Link from 'next/link'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input'
import * as yup from 'yup'
import { RequestDemoParams } from '../../../context/types'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import axios from 'axios'
import Hidden from '@mui/material/Hidden'
import { SAVE_REQUEST_DEMO } from 'src/apis'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 400,
  textAlign: 'left',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export interface DialogProps {
  show: boolean
  onClose: (value: boolean) => void
}

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

const defaultValues = {
  enterpriseName: '',
  enterpriseEmail: '',
  firstName: '',
  lastName: '',
  enterpriseScale: '',
  requirement: '',
  phoneNumber: ''
}

const schema = yup.object().shape({
  enterpriseName: yup.string().required(),
  enterpriseEmail: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  enterpriseScale: yup.string().required(),
  requirement: yup.string().required(),
  phoneNumber: yup
    .string()
    .required()
    .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
      return matchIsValidTel(value)
    })
})

const DialogRequestDemo = (dialogProps: DialogProps) => {
  const { show, onClose } = dialogProps
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')

  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      setDefaultCountry(i18n.language.replace('zh_', '') as MuiTelInputCountry)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
    } else {
      setDefaultCountry(i18n.language.toUpperCase() as unknown as MuiTelInputCountry)
    }
  }, [i18n.language])

  const {
    control: control,
    setError: setError,
    handleSubmit: handleSubmit,
    formState: { errors },
    resetField
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (params: RequestDemoParams) => {
    setLoading(true)

    try {
      const { phoneNumber, enterpriseName, enterpriseEmail, enterpriseScale, requirement, firstName, lastName } = params
      const postData: any = {}
      postData.mobileCountry = phoneNumber?.split(' ')?.[0]
      postData.mobile = phoneNumber?.replace(postData.mobileCountry, '').replace(/\s*/g, '')
      postData.orgName = enterpriseName
      postData.surname = firstName
      postData.name = lastName
      postData.email = enterpriseEmail
      postData.orgScale = enterpriseScale
      postData.requirement = requirement
      postData.host = `${location.origin}?language=${i18n.language}`
      const res = await axios.post(SAVE_REQUEST_DEMO, postData)
      setLoading(false)
      if (res?.data?.code === 'SUCCESS') {
        onClose(false)
        toast.success(t('Request demo success') || 'Request demo success', { position: 'top-center' })
      }
    } catch (e) {
      console.error(e)
      setLoading(false)
      toast.success(t('Request demo failed') || 'Request demo failed')
    }
  }

  const handleClose = () => {
    resetField('firstName')
    resetField('lastName')
    resetField('enterpriseEmail')
    resetField('enterpriseName')
    resetField('enterpriseScale')
    resetField('requirement')
    resetField('phoneNumber')
    onClose(false)
  }

  return (
    <Card>
      <Dialog
        fullWidth
        fullScreen={hidden}
        open={show}
        scroll='body'
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            height: '76vh',
            [theme.breakpoints.down('md')]: {
              height: '100vh'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              [theme.breakpoints.down('md')]: {
                justifyContent: 'center'
              },
              '.register-sidebar': {
                height: '76vh',
                width: '340px!important'
              }
            }}
          >
            <Sidebar hidden={hidden} hiddenExceptLogo={false} title={t('Request demo slogan') || ''} />

            <IconButton
              size='small'
              onClick={handleClose}
              sx={{ position: 'absolute', right: '2.5rem', top: '1.5rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>

            <Box
              sx={{
                px: 12,
                pt: 6,
                width: 'calc(100% - 340px)',
                height: '76vh',
                overflowY: 'scroll',
                [theme.breakpoints.down('md')]: {
                  width: '100%',
                  height: '100vh'
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                form: {
                  width: '100%'
                }
              }}
            >
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant='h4' sx={{ mb: 3 }}>
                      {t('Request demo title')}
                    </Typography>
                    <Typography variant='body2'>{t('Request demo description')}</Typography>
                  </Box>

                  <Grid sx={{ mb: 5 }} item xs={12}>
                    <Grid container spacing={5}>
                      <Grid item lg={5} md={5} sm={5} xs={5}>
                        <FormControl fullWidth>
                          <Controller
                            name='firstName'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                sx={{ backgroundColor: common.white }}
                                label={t('Request demo first name')}
                                value={value}
                                onChange={onChange}
                                error={Boolean(errors.firstName)}
                                placeholder={t('Request demo first name') || ''}
                              />
                            )}
                          />
                          {errors.firstName && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item lg={7} md={7} sm={7} xs={7}>
                        <FormControl fullWidth>
                          <Controller
                            name='lastName'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                sx={{ backgroundColor: common.white }}
                                label={t('Request demo last name')}
                                value={value}
                                onChange={onChange}
                                error={Boolean(errors.lastName)}
                                placeholder={t('Request demo last name') || ''}
                              />
                            )}
                          />
                          {errors.lastName && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid sx={{ mb: 4 }} item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field }) => (
                          <MuiTelInputStyled
                            {...field}
                            error={Boolean(errors.phoneNumber)}
                            defaultCountry={defaultCountry || 'CN'}
                            preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                            forceCallingCode
                            focusOnSelectCountry
                            onChange={field.onChange}
                            placeholder={t('Request demo phone number') || ''}
                          />
                        )}
                      />
                      {errors.phoneNumber && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                          }}
                        >
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>
                        </Box>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid sx={{ mb: 4 }} item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='enterpriseEmail'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            sx={{ backgroundColor: common.white }}
                            label={t('Request demo enterprise email')}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.enterpriseEmail)}
                            placeholder={t('Request demo enterprise email') || ''}
                          />
                        )}
                      />
                      {errors.enterpriseEmail && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.enterpriseEmail.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid sx={{ mb: 4 }} item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='enterpriseName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            sx={{ backgroundColor: common.white }}
                            label={t('Request demo enterprise name')}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.enterpriseName)}
                            placeholder={t('Request demo enterprise name') || ''}
                          />
                        )}
                      />
                      {errors.enterpriseName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.enterpriseName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid sx={{ mb: 4 }} item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='enterprise-scale-label'>{t('Request demo enterprise scale')}</InputLabel>
                      <Controller
                        name='enterpriseScale'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            label={t('Request demo enterprise scale')}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.enterpriseScale)}
                            aria-describedby='enterpriseScale'
                            placeholder={t('Request demo enterprise scale') || ''}
                            labelId={'enterprise-scale-label'}
                          >
                            <MenuItem value={t('Request demo enterprise scale 1-50')}>
                              {t('Request demo enterprise scale 1-50')}
                            </MenuItem>
                            <MenuItem value={t('Request demo enterprise scale 51-200')}>
                              {t('Request demo enterprise scale 51-200')}
                            </MenuItem>
                            <MenuItem value={t('Request demo enterprise scale 201-500')}>
                              {t('Request demo enterprise scale 201-500')}
                            </MenuItem>
                            <MenuItem value={t('Request demo enterprise scale 501-1000')}>
                              {t('Request demo enterprise scale 501-1000')}
                            </MenuItem>
                            <MenuItem value={t('Request demo enterprise scale 1000+')}>
                              {t('Request demo enterprise scale 1000+')}
                            </MenuItem>
                          </Select>
                        )}
                      />
                      {errors.enterpriseScale && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.enterpriseScale.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid sx={{ mb: 4 }} item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='requirement-label'>{t('Request demo requirement')}</InputLabel>
                      <Controller
                        name='requirement'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            label={t('Request demo requirement')}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.requirement)}
                            aria-describedby='requirement'
                            placeholder={t('Request demo requirement') || ''}
                            labelId={'requirement-label'}
                          >
                            <MenuItem value={t('Request demo requirement 1')}>
                              {t('Request demo requirement 1')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 2')}>
                              {t('Request demo requirement 2')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 3')}>
                              {t('Request demo requirement 3')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 4')}>
                              {t('Request demo requirement 4')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 5')}>
                              {t('Request demo requirement 5')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 6')}>
                              {t('Request demo requirement 6')}
                            </MenuItem>
                            <MenuItem value={t('Request demo requirement 7')}>
                              {t('Request demo requirement 7')}
                            </MenuItem>
                          </Select>
                        )}
                      />
                      {errors.requirement && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.requirement.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <LoadingButton
                    loading={loading}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    sx={{ mt: 5 }}
                  >
                    {t('Request demo submit')}
                  </LoadingButton>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 4,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      mt: 4
                    }}
                  >
                    <TypographyStyled
                      variant='body1'
                      sx={{
                        mr: 2
                      }}
                    >
                      {t('Request demo start travel')}{' '}
                      <LinkStyled href='/auth/register/step1'>{t('Request demo register')}</LinkStyled>
                    </TypographyStyled>
                    <Hidden smDown>
                      <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}> | </Divider>
                    </Hidden>
                    <TypographyStyled variant='body2'>{t('Request demo register description')}</TypographyStyled>
                  </Box>
                </Grid>
              </form>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogRequestDemo
