// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { styled } from '@mui/material/styles'
import { common } from '@mui/material/colors'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Icon } from '@iconify/react'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { saveEorContract, saveContractDetail } from 'src/store/apps/contract'
import { fetchConfigListByCountry} from "@/store/apps/config";
import toast from 'react-hot-toast'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'
import {CountryItem, CityItem, AreaItem } from 'src/types/apps/area'
import { filterCountrySupported } from '../../../@core/utils/filter-country-supported'
import {WeWork} from "@/views/contract/create/components/WeWork";
import axios from 'axios'
import {
  GET_LOCALE_COUNTRY
} from 'src/apis/contract'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
}

interface FormInputs {
  employeeName: string
  employeePhoneNumber: string
  employeeEmail: string
  employeeNationality: string
  employeeWorkPlace: string
  employeeWorkState: string
  employeeWorkCity: string
  employeeWorkVisa: string
  employeeIDCardType: string
  employeeIDCardNum: string
}

const schema = yup.object().shape({
  employeeName: yup.string().required(),
  employeeEmail: yup.string().email().required(),
  employeePhoneNumber: yup
    .string()
    .required()
    .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
      return matchIsValidTel(value)
    }),
  employeeNationality: yup.string().required(),
  employeeWorkPlace: yup.string().required(),
  employeeWorkState: yup.string().required(),
  employeeWorkCity: yup.string().required(),
  employeeWorkVisa: yup.string().required(),
  employeeIDCardType: yup.string().required(),
  employeeIDCardNum: yup.string().required().test('employeeIDCardNum', '请正确填写证件号码', function () {
    const type = this.parent.employeeIDCardType;
    if(!type) {
      return false
    } else {
      let result = true
      switch (type) {
        case '1':
          if (this.parent.employeeNationality === 'CN') {
            result = new RegExp(/(^[a-zA-Z0-9]{15}$)|(^[a-zA-Z0-9]{18}$)/).test(this.parent.employeeIDCardNum);
          }
          break;
        default:
          break;
      }
      return result
    }
  })
})

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'left',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  paddingLeft: 15,
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

const defaultIdCardTypeList: any[] = [
  {
    id: '3',
    name: '台湾通行证'
  },
  {
    id: '1',
    name: '身份证'
  },
   {
    id: '2',
    name: '港澳通行证'
  },
   {
    id: '4',
    name: '台湾身份证'
  },
   {
    id: '5',
    name: '护照'
  },

]

const Step1 = ({ setStep, orgId, contractId }: Props) => {
  const { t, i18n } = useTranslation()
  const [showWorkVisaDialog, setShowWorkVisaDialog] = useState(false)
  const [showWorkVisaTip, setShowWorkVisaTip] = useState(false)
  const [showWorkVisaSelect, setShowWorkVisaSelect] = useState(false)
  const [countries, setCountries] = useState<CountryItem[]>([])
  const [workCountries, setWorkCountries] = useState<CountryItem[]>([])
  const [idCardTypeList, setIdCardTypeList] = useState<any[]>([...defaultIdCardTypeList])
  const [statesCities, setStatesCities] = useState<any[]>([])
  const [currentLocale, setCurrentLocale] = useState<any>(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const [currentStates, setCurrentStates] = useState<AreaItem[]>([])
  const [currentCities, setCurrentCities] = useState<CityItem[]>([])
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')
  const {
    currentContract
  } = useSelector((state: RootState) => state.contract)

  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      const loc = i18n.language.replace('zh_', '') as MuiTelInputCountry
      setDefaultCountry(loc)
      setValue('employeeNationality',loc)
      setValue('employeeWorkPlace',loc)
      fetchStates(loc)
      fetchStatesCities(loc)
      changeCardTypeList(loc)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
      setValue('employeeNationality','US')
      setValue('employeeWorkPlace','US')
      fetchStates('US')
      fetchStatesCities('US')
      changeCardTypeList('US')
    } else {
      const loc2 = i18n.language.toUpperCase() as unknown as MuiTelInputCountry
      setDefaultCountry(loc2)
      setValue('employeeNationality',loc2)
      setValue('employeeWorkPlace',loc2)
      fetchStates(loc2)
      fetchStatesCities(loc2)
      changeCardTypeList(loc2)
    }
  }, [i18n.language])


  useEffect(() => {
    const {staff} = currentContract;
    if (!staff) return
    setValue('employeeName', staff.staffName)
    setValue('employeePhoneNumber',  staff.staffMobileCountry + ' ' + staff.staffMobile)
    setValue('employeeEmail', staff.staffEmail)
    setValue('employeeNationality', staff.staffNationality)
    setValue('employeeWorkPlace', staff.staffWorkplaceCountry)
    setValue('employeeWorkState', staff.staffWorkplaceState)
    setValue('employeeWorkCity', staff.staffWorkplaceCity)
    setValue('employeeWorkVisa', staff.staffWorkVisaCode)
    setValue('employeeIDCardNum', staff.staffIDCardNumber)
    setValue('employeeIDCardType', staff.staffIDCardType)
    if(staff.staffWorkplaceCountry) {
      fetchStates(staff.staffWorkplaceCountry)
    }
    if(staff.staffWorkplaceState) {
      fetchStatesCities(staff.staffWorkplaceState)
    }
  }, [currentContract])

  const defaultValues = {
    employeeName: '',
    employeePhoneNumber: '',
    employeeEmail: '',
    employeeNationality: defaultCountry || 'CN',
    employeeWorkPlace: defaultCountry || 'CN',
    employeeWorkState: '',
    employeeWorkCity: '',
    employeeWorkVisa: '',
    employeeIDCardType: '',
    employeeIDCardNum: '',
  }

  const {
    control,
    trigger,
    watch,
    register,
    unregister,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  const fetchCountries = () => {
    fetch('/api/basic/opening/list-area?parent=0')
      .then(response => {
        return response.json()
      })
      .then(data => {
        const areaCode: any = ['US', 'KR', 'SG', 'TH', 'AE', 'TW', 'JP', 'HK','CN']
        const tempArr: any = [...data.data];
        for(let i = 0;i < areaCode.length;i++) {
          const tempIndex = tempArr.findIndex((v: any) => v.areaCode === areaCode[i]);
          if(tempIndex !== -1) {
            const temp = tempArr.splice(tempIndex, 1)[0];
            tempArr.unshift(temp)
          }
        }
        console.log(tempArr)

        // setCountries(filterCountrySupported(data))
        setCountries(tempArr)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const fetchtFilterCountries = async () => {
    axios.get(GET_LOCALE_COUNTRY, {params:
      {
        parent:'0',
        action:'WORK-COUNTRY'
      }
    }).then(res => {
      setWorkCountries(res.data.data)
    })
  }

  const fetchStates = (areaCode:string) => {
    fetch('/api/basic/opening/list-area?parent='+ areaCode)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCurrentStates(data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const fetchStatesCities = (areaCode:string) => {
    fetch('/api/basic/opening/list-area?parent='+ areaCode)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCurrentCities(data.data)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  useEffect(() => {
    console.log('创建合同v1.0.01')
    fetchCountries()
    fetchtFilterCountries()
    fetchStates(defaultCountry);
  }, [])

  const dispatch = useDispatch<AppDispatch>()
  const { contract } = useSelector((state: RootState) => state.contract)

  useEffect(() => {
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'employeeWorkVisa') {
        setShowWorkVisaTip(Number(getValues('employeeWorkVisa')) === 10 ? false : true)
      }
      setShowWorkVisaSelect(getValues('employeeNationality') !== getValues('employeeWorkPlace'))

      if(name === 'employeeNationality') {
        changeCardTypeList(value.employeeNationality)
      }

      if (name === 'employeeWorkPlace' && type === 'change') {
        // setCurrentStates(statesCities.filter((sc: any) => sc.country_id === getValues('employeeWorkPlace')))
        setCurrentCities([])
        setValue('employeeWorkState', '')
        setValue('employeeWorkCity', '')
        fetchStates(getValues('employeeWorkPlace'));
      }

      if (name === 'employeeWorkState' && type === 'change') {
        // setCurrentCities((statesCities.find((sc: any) => sc.id === getValues('employeeWorkState')) as any)?.cities)
        setValue('employeeWorkCity', '')
        fetchStatesCities(getValues('employeeWorkState'));
      }

    })
    return () => subscription.unsubscribe()
  }, [watch, statesCities])

  const changeCardTypeList = (value: any) => {
    switch (value) {
      case 'CN':
        setIdCardTypeList([
          {
            id: '1',
            name: '身份证'
          }
        ]);
        break;
      case 'TW':
        setIdCardTypeList([
          {
            id: '4',
            name: '台湾身份证'
          },
          {
            id: '5',
            name: '护照'
          }
        ]);
        break;
      case 'HK':
        setIdCardTypeList([
          {
            id: '1',
            name: '身份证'
          },
          {
            id: '2',
            name: '港澳通行证'
          },
        ]);
        break;
      default:
        setIdCardTypeList([
          {
            id: '1',
            name: '身份证'
          },
          {
            id: '5',
            name: '护照'
          },
        ]);
        break;
    }
    setValue('employeeIDCardType', '');
  }


  const onSubmit = async () => {
    let fields: string[] = []
    if (showWorkVisaSelect) {
      register('employeeWorkVisa')
      fields = [
        'employeeName',
        'employeePhoneNumber',
        'employeeEmail',
        'employeeNationality',
        'employeeWorkPlace',
        'employeeWorkState',
        'employeeWorkCity',
        'employeeWorkVisa',
        'employeeIDCardType',
        'employeeIDCardNum'
      ]
    } else {
      unregister('employeeWorkVisa')
      fields = [
        'employeeName',
        'employeePhoneNumber',
        'employeeEmail',
        'employeeNationality',
        'employeeWorkPlace',
        'employeeWorkState',
        'employeeWorkCity',
        'employeeIDCardType',
        'employeeIDCardNum'
      ]
    }

    const valid = await trigger(fields as any)
    if (valid) {
      const tempParams = {
        action: 'STAFF',
        contractId,
        orgId,
        teamId: '1',
        type: 'EOR',
        staff: {
          staffName: getValues('employeeName'),
          staffMobileCountry: getValues('employeePhoneNumber')?.split(' ')?.[0],
          staffMobile: getValues('employeePhoneNumber')
            ?.replace(getValues('employeePhoneNumber')?.split(' ')?.[0], '')
            .replace(/\s*/g, ''),
          staffEmail: getValues('employeeEmail'),
          staffNationality: getValues('employeeNationality'),
          staffWorkplaceCountry: getValues('employeeWorkPlace'),
          staffWorkplaceState: getValues('employeeWorkState'),
          staffWorkplaceCity: getValues('employeeWorkCity'),
          staffWorkVisaCode: getValues('employeeWorkVisa'),
          staffIDCardNumber: getValues('employeeIDCardNum'),
          staffIDCardType: getValues('employeeIDCardType'),
        }
      }
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract(tempParams)
      )

      if (code === 'SUCCESS') {
        // 第一步保存时同时将部分信息保存
        const customContract: any = {...currentContract, ...tempParams}
        customContract.staffWorkplaceCountryName = countries?.find(v => v.areaCode === tempParams.staff.staffWorkplaceCountry)?.name
        customContract.staffWorkplaceStateName = (currentStates || []).find(v => v.areaCode === tempParams.staff.staffWorkplaceState)?.name
        customContract.staffWorkplaceCityName = (currentCities || []).find(v => v.areaCode === tempParams.staff.staffWorkplaceCity)?.name
        await dispatch(saveContractDetail(customContract))
        await dispatch(fetchConfigListByCountry({
          rgroup : `page.contract.eor.create.${tempParams.staff.staffWorkplaceCountry}`,
          rkey : 'standard.salary.min'
        }))
        setStep(prev => prev + 1)
      } else {
        toast.error(error, { position: 'top-right' })
      }
    }
  }

  return (
    <Box>
      <form>
        <Card sx={{ my: 5 }}>
          <CardHeader title={t('Staff.Employee_info')} />

          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='employeeName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('Staff.Employee_name')}
                        placeholder={t('Staff.Employee_name') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeName)}
                        aria-describedby='employeeName'
                      />
                    )}
                  />
                  {errors.employeeName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='employeePhoneNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <MuiTelInputStyled
                        {...field}
                        error={Boolean(errors.employeePhoneNumber)}
                        defaultCountry={defaultCountry || 'CN'}
                        preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                        forceCallingCode
                        focusOnSelectCountry
                        placeholder={t('Staff.Employee_phone_number') || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.employeePhoneNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeePhoneNumber.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='employeeEmail'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        label={t('Staff.Employee_email')}
                        placeholder={t('Staff.Employee_email') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeEmail)}
                        aria-describedby='employeeEmail'
                      />
                    )}
                  />
                  {errors.employeeEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeEmail.message}</FormHelperText>
                  )}
                </FormControl>

                <TypographyStyled variant={'body2'} sx={{ pl: 2 }}>
                  {t('Staff.Employee_email_send_note')}
                </TypographyStyled>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.employeeNationality)} htmlFor='employeeNationality'>
                    {t('Staff.Employee_nationality')}
                  </InputLabel>
                  <Controller
                    name='employeeNationality'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.Employee_nationality')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeNationality)}
                        aria-describedby='employeeNationality'
                      >
                        {countries.map((country: any) => (
                          <MenuItem value={country.areaCode}>{ country.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeNationality && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeNationality.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.employeeIDCardType)} htmlFor='employeeIDCardType'>
                    {t('Document type')}
                  </InputLabel>
                  <Controller
                    name='employeeIDCardType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.employeeIDCardType')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeIDCardType)}
                        aria-describedby='employeeIDCardType'
                      >
                        {idCardTypeList.map((v: any) => (
                          <MenuItem value={v.id}>{ v.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeIDCardType && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeIDCardType.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='employeeIDCardNum'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('ID Number')}
                        placeholder={t('ID Number') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeIDCardNum)}
                        aria-describedby='employeeIDCardNum'
                      />
                    )}
                  />
                  {errors.employeeIDCardNum && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeIDCardNum.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.employeeWorkPlace)} htmlFor='employeeWorkPlace'>
                    {t('Staff.Employee_work_place')}
                  </InputLabel>
                  <Controller
                    name='employeeWorkPlace'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.Employee_work_place')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeWorkPlace)}
                        aria-describedby='employeeWorkPlace'
                      >
                        {workCountries.map((country: any) => (
                          <MenuItem value={country.areaCode}>{ country.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeWorkPlace && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeWorkPlace.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.employeeWorkState)} htmlFor='employeeWorkState'>
                    {t('Staff.Employee_work_state')}
                  </InputLabel>
                  <Controller
                    name='employeeWorkState'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.Employee_work_state')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeWorkState)}
                        labelId='employeeWorkState'
                        aria-describedby='employeeWorkState'
                      >
                        {currentStates.map((state: any) => (
                          <MenuItem value={state.areaCode}>{state.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeWorkState && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeWorkState.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.employeeWorkCity)} htmlFor='employeeWorkCity'>
                    {t('工作地城市')}
                  </InputLabel>
                  <Controller
                    name='employeeWorkCity'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.Employee_work_state')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.employeeWorkCity)}
                        labelId='employeeWorkCity'
                        aria-describedby='employeeWorkCity'
                      >
                        {currentCities.map((city: any) => (
                          <MenuItem value={city.areaCode}>{city.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeWorkCity && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeWorkCity.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {showWorkVisaSelect && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.employeeWorkVisa)} htmlFor='employeeWorkVisa'>
                      {t('Staff.Employee_work_visa')}
                    </InputLabel>
                    <Controller
                      name='employeeWorkVisa'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={t('Staff.Employee_work_visa')}
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.employeeWorkVisa)}
                          aria-describedby='jobTitle'
                        >
                          <MenuItem value={10}>{t('Staff.Work_visa_gained')}</MenuItem>
                          <MenuItem value={20}>{t('Staff.Work_visa_no_gained')}</MenuItem>
                          <MenuItem value={30}>{t('Staff.Work_visa_platform_resolve')}</MenuItem>
                          <MenuItem value={40}>{t('Staff.Work_visa_no_sure')}</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.employeeWorkVisa && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.employeeWorkVisa.message}</FormHelperText>
                    )}
                  </FormControl>

                  {showWorkVisaTip && (
                    <Box
                      onClick={() => setShowWorkVisaDialog(true)}
                      sx={theme => ({
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        color: theme.palette.info.light
                      })}
                    >
                      <TypographyStyled sx={theme => ({ color: theme.palette.info.light, pl: 2 })} variant={'body2'}>
                        {t('如何帮助员工申请工作签证')}
                      </TypographyStyled>
                      <Icon icon='ic:round-arrow-outward' />
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>

            <Dialog
              onClose={() => setShowWorkVisaDialog(false)}
              aria-labelledby='customized-dialog-title'
              open={showWorkVisaDialog}
            >
              <DialogTitle
                id='customized-dialog-title'
                sx={{
                  px: 8,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant='h6' component='span'>
                  {t('如何帮助员工申请工作签证？')}
                </Typography>
                <IconButton
                  aria-label='close'
                  onClick={() => setShowWorkVisaDialog(false)}
                  sx={{ top: 20, right: 20, position: 'absolute', color: 'grey.500' }}
                >
                  <Icon icon='mdi:close' />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 8 }}>
                <Typography sx={{ mb: 4 }}>
                  {t(
                    '联系您的客户服务经理了解更多信息。如果我们能够在该国帮助员工申请签证，您的下一步就是与您的客户经理沟通。他们能够为您提供更多信息，包括：'
                  )}
                </Typography>
                <Box>
                  <ul>
                    <li>{t('签证申请费用')}</li>
                    <li>{t('签证申请处理时间')}</li>
                    <li>{t('申请的最低要求')}</li>
                  </ul>
                </Box>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Grid item xs={12}>
          <Button size='large' variant='contained' sx={{ width: '100%' }} onClick={onSubmit}>
            {t('Staff.Next_step')}
          </Button>
        </Grid>
      </form>
    </Box>
  )
}

export default Step1
