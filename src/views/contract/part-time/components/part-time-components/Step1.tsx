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
import { DateType } from '@/types/forms/reactDatepickerTypes'
import {styled, useTheme} from '@mui/material/styles'
import { common } from '@mui/material/colors'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Icon } from '@iconify/react'
import {Collapse, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { saveFixedCostContract, getFixedCostContractDetailById } from '@/store/apps/contract'
import toast from 'react-hot-toast'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'
import {CountryItem, CityItem, AreaItem } from '@/types/apps/area'
import { filterCountrySupported } from '@/@core/utils/filter-country-supported'
import {WeWork} from "@/views/contract/create/components/WeWork";
import axios from 'axios'
import {
  GET_LOCALE_COUNTRY
} from '@/apis/contract'
import {fetchAllOrg, fetchAllTeam} from "@/store/apps/org";
import {
  deleteCustomJobScope,
  fetchCustomJobDesc,
  fetchCustomJobScope, fetchJobScope,
  fetchJobTitle,
  fetchStandardCustomJobDesc, saveCustomJobScope
} from "@/store/apps/job";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput'
import {date} from "yup";

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
}

interface FormInputs {
  contractName: string
  staffName: string
  staffMobile: string
  staffEmail: string,
  staffIDCardType: string,
  staffIDCardNumber: string,
  staffNationality: string,
  staffWorkplaceCountry: string,
  staffWorkplaceState: string,
  staffWorkplaceCity: string,
  teamId: string,
  entiryId: string,
  jobTitle: string,
  jobDuty: string,
}

const schema = yup.object().shape({
  contractName: yup.string().required(),
  staffName: yup.string().required(),
  staffIDCardType: yup.string().required(),
  staffIDCardNumber: yup.string().required(),
  staffEmail: yup.string().email().required(),
  staffMobile: yup
    .string()
    .required()
    .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
      return matchIsValidTel(value)
    }),
  staffNationality: yup.string().required(),
  staffWorkplaceCountry: yup.string().required(),
  staffWorkplaceState: yup.string().required(),
  staffWorkCity: yup.string().required(),
  teamId: yup.string().required(),
  entiryId: yup.string().required(),
  jobTitle: yup.string().required(),
  jobDuty: yup.string().required(),
})

const filter = createFilterOptions<JobTitleOption>()

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

interface DialogFormInputs {
  customJobScopeTitle: string
}

interface JobTitleOption {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

type TitleOptionType = {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

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
  const theme = useTheme()
  const [countries, setCountries] = useState<CountryItem[]>([])
  const [idCardTypeList, setIdCardTypeList] = useState<any[]>([...defaultIdCardTypeList])
  const [workCountries, setWorkCountries] = useState<CountryItem[]>([])
  const [statesCities, setStatesCities] = useState([])
  const [currentLocale, setCurrentLocale] = useState(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const [currentStates, setCurrentStates] = useState<AreaItem[]>([])
  const [currentCities, setCurrentCities] = useState<CityItem[]>([])
  const [defaultCountry, setDefaultCountry] = useState<MuiTelInputCountry>('CN')
  const [jobTitleOptions, setJobTitleOptions] = useState<TitleOptionType[]>([])
  const [jobTitle, setJobTitle] = useState<JobTitleOption | null>(null)
  const [showJobScopeList, setShowJobScopeList] = useState(false)
  const [showCustomJobScopeList, setShowCustomJobScopeList] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [showJobScopeAddDialog, setShowJobScopeAddDialog] = useState(false)
  const { organizations, teams } = useSelector((state: RootState) => state.org)
  const {
    jobTitleList: { basicJobTitleTree, popularJobTitles },
    jobScopeList,
    customJobScopeList
  } = useSelector((state: RootState) => state.job)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (i18n.language.startsWith('zh_')) {
      const loc = i18n.language.replace('zh_', '') as MuiTelInputCountry
      setDefaultCountry(loc)
      setValue('staffNationality',loc)
      setValue('staffWorkplaceCountry',loc)
      fetchStates(loc)
      fetchStatesCities(loc)
      changeCardTypeList(loc)
    } else if (i18n.language === 'en') {
      setDefaultCountry('US')
      setValue('staffNationality','US')
      setValue('staffWorkplaceCountry','US')
      fetchStates('US')
      fetchStatesCities('US')
      changeCardTypeList('US')
    } else {
      const loc2 = i18n.language.toUpperCase() as unknown as MuiTelInputCountry
      setDefaultCountry(loc2)
      setValue('staffNationality',loc2)
      setValue('staffWorkplaceCountry',loc2)
      fetchStates(loc2)
      fetchStatesCities(loc2)
      changeCardTypeList(loc2)
    }
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

  useEffect(() => {
    if (basicJobTitleTree) {
      const titles: TitleOptionType[] = popularJobTitles.map((pj: { rkey: any; rvalue: any }) => {
        return {
          categoryCode: '',
          categoryName: t('经常使用'),
          titleKey: pj.rkey,
          titleName: pj.rvalue,
          inputValue: ''
        }
      })

      basicJobTitleTree.forEach((a: any) => {
        a.jobTitles.forEach((j: any) => {
          const jt = {
            categoryCode: a.categoryCode,
            categoryName: a.categoryName,
            titleKey: j.rkey,
            titleName: j.rvalue,
            inputValue: ''
          }
          titles.push(jt)
        })
      })
      setJobTitleOptions(titles)
    }
  }, [basicJobTitleTree])

  const defaultValues = {
    contractName: '',
    staffName: '',
    staffMobile: '',
    staffEmail: '',
    staffIDCardType: '',
    staffIDCardNumber: '',
    staffNationality: '',
    staffWorkplaceCountry: '',
    staffWorkplaceState: '',
    staffWorkplaceCity: '',
    teamId: '',
    entiryId: '',
    jobTitle: '',
    jobDuty: '',
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

  const defaultValuesDialog = {
    customJobScopeTitle: ''
  }

  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })


  const {
    control: controlDialog,
    getValues: getValuesDialog,
    handleSubmit: handleSubmitDialog,
    resetField: resetFieldDialog,
    formState: { errors: errorsDialog }
  } = useForm<DialogFormInputs>({ defaultValues: defaultValuesDialog, mode: 'onChange', resolver: yupResolver(schemaDialog) })


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
        setCountries(tempArr)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }
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
    setValue('staffIDCardType', '');
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

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {

      if(name === 'staffNationality') {
        changeCardTypeList(value.staffNationality)
      }

      if (name === 'staffWorkplaceCountry' && type === 'change') {
        // setCurrentStates(statesCities.filter((sc: any) => sc.country_id === getValues('staffWorkplaceCountry')))
        setCurrentCities([])
        setValue('staffWorkplaceState', '')
        setValue('staffWorkplaceCity', '')
        fetchStates(getValues('staffWorkplaceCountry'));
      }

      if (name === 'staffWorkplaceState' && type === 'change') {
        // setCurrentCities((statesCities.find((sc: any) => sc.id === getValues('staffWorkplaceState')) as any)?.cities)
        setValue('staffWorkplaceCity', '')
        fetchStatesCities(getValues('staffWorkplaceState'));
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, statesCities])

  const onSubmit = async () => {
    const fields: string[] = Object.keys(defaultValues)

    const valid = await trigger(fields as any)
    if (valid) {
      const tempParams = {
        action: 'STAFF-JOB-TITLE',
        contractId,
        orgId,
        teamId: getValues('teamId'),
        type: 'temporary',
        staff: {
          staffName: getValues('staffName'),
          staffMobileCountry: getValues('staffMobile')?.split(' ')?.[0],
          staffMobile: getValues('staffMobile')
            ?.replace(getValues('staffMobile')?.split(' ')?.[0], '')
            .replace(/\s*/g, ''),
          staffEmail: getValues('staffEmail'),
          staffNationality: getValues('staffNationality'),
          staffWorkplaceCountry: getValues('staffWorkplaceCountry'),
          staffWorkplaceState: getValues('staffWorkplaceState'),
          staffWorkplaceCity: getValues('staffWorkplaceCity'),
          staffWorkVisaCode: '',
          staffIDCardType: getValues('staffIDCardType'),
          staffIDCardNumber: getValues('staffIDCardNumber')
        },
        jobTitle: {
          teamId: getValues('teamId'),
          entiryId: getValues('entiryId'),
          jobTitle: getValues('jobTitle'),
          jobDuty: getValues('jobDuty'),
        }
      }
      console.log(tempParams)
      const {
        payload: { code }
      } = await dispatch(
        saveFixedCostContract(tempParams)
      )

      if (code === 'SUCCESS') {
        await dispatch(getFixedCostContractDetailById({orgId, contractId}))
        setStep(prev => prev + 1)
      } else {
        toast.error(t('员工信息保存错误') || '', { position: 'top-center' })
      }
    }
  }


    const GroupHeader = styled('div')(({ theme }) => ({
      padding: '4px 10px',
      color: theme.palette.primary.main
    }))

    const GroupItems = styled('ul')({
      padding: 0
    })

    const handleSaveJobScope = () => {
      if (getValues('jobDuty')) {
        setShowJobScopeAddDialog(true)
        resetFieldDialog('customJobScopeTitle')
      }
    }

    const handleClickPresetJobScope = async (jobId: string) => {
      //获取标签详情描述
      const {
        payload: { data }
      } = await dispatch(fetchCustomJobDesc({orgId, jobId}))
      setValue('jobDuty', data.descn)
    }

    const handleClickPresetStandardJobScope = async (jobId: string) => {
      //获取标签详情描述
      const {
        payload: { data }
      } = await dispatch(fetchStandardCustomJobDesc({ orgId, jobId }))
      setValue('jobDuty', data.descn)
    }

    const handleDeletePresetJobScope = async (jobId: string) => {
      const {
        payload: { code }
      } = await dispatch(deleteCustomJobScope({ orgId, jobId }))

      if (code === 'SUCCESS') {
        await dispatch(fetchCustomJobScope({ orgId }))
      } else {
        toast.error(t('删除自定义职位范围失败') || '', { position: 'top-center' })
      }
    }

    const handleJobScopeDialogClose = () => {
      setShowJobScopeAddDialog(false)
    }

  const onCustomJobScopeSubmit = async () => {
    const params = {
      code: getValuesDialog('customJobScopeTitle'),
      orgId,
      jobTitles: [
        {
          bizType: 'JOB_TITLE',
          lng: i18n.language,
          content: getValuesDialog('customJobScopeTitle')
        }
      ],
      descriptions: [
        {
          bizType: 'JOB_DESC',
          lng: i18n.language,
          content: getValues('jobDuty')
        }
      ],
    }
    const {
      payload: { code }
    } = await dispatch(
      saveCustomJobScope(params)
    )
    if (code === 'SUCCESS') {
      setShowJobScopeAddDialog(false)
      await dispatch(fetchCustomJobScope({ orgId }))
    } else {
      toast.error(t('自定义职位范围保存失败') || '', { position: 'top-center' })
    }
  }



  return (
    <Box>
      <form>
        <Card sx={{ mb: 5, mt: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='contractName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('合同名称')}
                        placeholder={t('合同名称') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.contractName)}
                        aria-describedby='contractName'
                      />
                    )}
                  />
                  {errors.contractName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.contractName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.entiryId)} htmlFor='entiryId'>
                    {t('Entity')}
                  </InputLabel>
                  <Controller
                    name='entiryId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Entity')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.entiryId)}
                        aria-describedby='staffNationality'
                      >
                        {organizations.map((o: any) => (
                          <MenuItem key={o.entiryId} value={o.entiryId}>{o.entiryName}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.entiryId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.entiryId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.teamId)} htmlFor='teamId'>
                    {t('Team')}
                  </InputLabel>
                  <Controller
                    name='teamId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Team')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.teamId)}
                        aria-describedby='teamId'
                      >
                        {teams.map((o: any) => (
                          <MenuItem key={o.teamId} value={o.teamId}>{o.teamName}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.teamId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.teamId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Typography sx={{fontSize: 16, fontWeight: 600, color: '#3A3541DE'}}>临时工/承包商信息</Typography>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='staffName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        label={t('姓名')}
                        placeholder={t('姓名') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffName)}
                        aria-describedby='staffName'
                      />
                    )}
                  />
                  {errors.staffName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='staffEmail'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        label={t('电子邮箱')}
                        placeholder={t('电子邮箱') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffEmail)}
                        aria-describedby='staffEmail'
                      />
                    )}
                  />
                  {errors.staffEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffEmail.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='staffMobile'
                    control={control}
                    render={({ field }) => (
                      <MuiTelInputStyled
                        {...field}
                        sx={{mb: 6}}
                        error={Boolean(errors.staffMobile)}
                        defaultCountry={'CN'}
                        preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                        forceCallingCode
                        placeholder={t('Login.Mobile_placeholder') || ''}
                        focusOnSelectCountry
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.staffMobile && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffMobile.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.staffNationality)} htmlFor='staffNationality'>
                    {t('国籍')}
                  </InputLabel>
                  <Controller
                    name='staffNationality'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('临时员工的税收国家/地区')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffNationality)}
                        aria-describedby='staffNationality'
                      >
                        {countries.map((country: any) => (
                          <MenuItem key={country.aredCode} value={country.areaCode}>{ country.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.staffNationality && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffNationality.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.staffIDCardType)} htmlFor='staffIDCardType'>
                    {t('Document type')}
                  </InputLabel>
                  <Controller
                    name='staffIDCardType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Staff.staffIDCardType')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffIDCardType)}
                        aria-describedby='staffIDCardType'
                      >
                        {idCardTypeList.map((v: any) => (
                          <MenuItem value={v.id}>{ v.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.staffIDCardType && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffIDCardType.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='staffIDCardNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('ID Number')}
                        placeholder={t('ID Number') || ''}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffIDCardNumber)}
                        aria-describedby='staffIDCardNumber'
                      />
                    )}
                  />
                  {errors.staffIDCardNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffIDCardNumber.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.staffNationality)} htmlFor='staffNationality'>
                    {t('纳税地')}
                  </InputLabel>
                  <Controller
                    name='staffWorkplaceCountry'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('纳税地')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffWorkplaceCountry)}
                        aria-describedby='staffWorkplaceCountry'
                      >
                        { workCountries.map((country: any) => (
                          <MenuItem key={country.areaCode} value={country.areaCode}>{ country.name }</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.staffWorkplaceCountry && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffWorkplaceCountry.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.staffWorkplaceState)} htmlFor='staffWorkplaceState'>
                    {t('税收地省/州')}
                  </InputLabel>
                  <Controller
                    name='staffWorkplaceState'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('税收地省/州')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffWorkplaceState)}
                        labelId='staffWorkplaceState'
                        aria-describedby='staffWorkplaceState'
                      >
                        {currentStates.map((state: any) => (
                          <MenuItem key={state.areaCode} value={state.areaCode}>{state.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.staffWorkplaceState && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffWorkplaceState.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.staffWorkplaceCity)} htmlFor='staffWorkplaceCity'>
                    {t('税收地城市')}
                  </InputLabel>
                  <Controller
                    name='staffWorkplaceCity'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('税收地城市')}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.staffWorkplaceCity)}
                        labelId='staffWorkplaceCity'
                        aria-describedby='staffWorkplaceCity'
                      >
                        {currentCities.map((city: any) => (
                          <MenuItem key={city.areaCode} value={city.areaCode}>{city.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.staffWorkplaceCity && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.staffWorkplaceCity.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              </Grid>
          </CardContent>
        </Card>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      freeSolo
                      clearOnBlur
                      value={jobTitle}
                      selectOnFocus
                      handleHomeEndKeys
                      options={jobTitleOptions}
                      groupBy={(option: any) => option.categoryName}
                      renderGroup={params => (
                        <li className={'job-title'} key={params.key}>
                          <GroupHeader>{params.group}</GroupHeader>
                          <GroupItems>{params.children}</GroupItems>
                        </li>
                      )}
                      renderInput={params => <TextField {...params} label={t('Staff.Employee_job_title')} />}
                      getOptionLabel={option => {
                        if (typeof option === 'string') {
                          return option || ''
                        }
                        if ((option as JobTitleOption).inputValue as string) {
                          return ((option as JobTitleOption).inputValue as string) || ''
                        }

                        return (option.titleName as string) || ''
                      }}
                      onChange={async (event, newValue) => {
                        console.log(newValue);
                        if (typeof newValue === 'string') {
                          setJobTitle({
                            titleName: newValue
                          })
                          setValue('jobTitle', newValue)
                          dispatch(fetchJobScope({ keywords: newValue }))
                          setShowJobScopeList(true)
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          setJobTitle({
                            titleName: newValue.titleName
                          })
                          setValue('jobTitle', newValue.titleName || '')
                          setShowJobScopeList(false)
                        } else {
                          setJobTitle({
                            titleName: newValue?.titleName
                          })
                          setValue('jobTitle', newValue?.titleName || '')
                          dispatch(fetchJobScope({ keywords: newValue?.titleName }))
                          setShowJobScopeList(true)
                        }

                        await trigger('jobTitle')
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params)
                        const { inputValue } = params

                        // Suggest the creation of a new value
                        const isExisting = options.some(option => inputValue === option.titleName)
                        if (inputValue !== '' && !isExisting) {
                          filtered.push({
                            inputValue: `添加 "${inputValue}"`,
                            titleName: inputValue,
                            titleKey: '',
                            categoryCode: '',
                            categoryName: ''
                          })
                        }
                        return filtered
                      }}
                    />
                    {errors.jobTitle && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.jobTitle.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <CardHeader sx={{ ml: -4, pb: 0 }} title={t('Scope of work')} />

              <TypographyStyled sx={{ pl: 0 }} variant={'body2'}>
                {t('The scope of work description of the employee will be included in the employment agreement, please fill out the formal')}
              </TypographyStyled>

              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.jobDuty)} htmlFor='jobDuty'></InputLabel>
                    <Controller
                      name='jobDuty'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Box sx={{ position: 'relative' }}>
                          <TextField
                            sx={{
                              backgroundColor: common.white,
                              width: '100%',
                              '.MuiInputBase-root': {
                                backgroundColor: common.white,
                                pr: 45
                              }
                            }}
                            placeholder={t('Scope of Work Statement') || ''}
                            rows={4}
                            value={value}
                            onChange={onChange}
                            multiline
                            variant='outlined'
                          />
                          <Button
                            onClick={handleSaveJobScope}
                            startIcon={<Icon width={16} icon='icon-park-outline:doc-success' />}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              color: theme.palette.grey.A400,
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: theme.palette.primary.main
                              }
                            }}
                          >
                            {t('Scope of Work Statement Archive')}
                          </Button>
                        </Box>
                      )}
                    />
                    {errors.jobDuty && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.jobDuty.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              {showJobScopeList && Array.isArray(jobScopeList) && jobScopeList.length > 0 && (
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        mt: 4,
                        p: 4,
                        border: '2px dashed #EBEEF5',
                        borderRadius: '8px',
                        backgroundColor: theme.palette.grey['50']
                      }}
                    >
                      <TypographyStyled sx={{ pl: 0, mb: 4, color: theme.palette.info.main }} variant={'body2'}>
                        {t('按照你填写的职称为你推荐的职位描述')}
                      </TypographyStyled>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          flexWrap: 'wrap',
                          gap: 4
                        }}
                      >
                        {jobScopeList?.map((s: any) => (
                          <Chip variant='outlined' label={s.descn ?? s.jobTitle} onClick={()=>handleClickPresetStandardJobScope(s.jobId)} />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 4,
                      p: 4,
                      border: '2px dashed #EBEEF5',
                      borderRadius: '8px',
                      backgroundColor: theme.palette.grey['50'],
                      position: 'relative'
                    }}
                  >
                    <Box
                      onClick={() => setShowCustomJobScopeList(!showCustomJobScopeList)}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '50%'
                      }}
                    >
                      <TypographyStyled sx={{ pl: 0, color: theme.palette.info.main, mr: 1 }} variant={'body2'}>
                        {t('Select saved scope of work descriptions')}
                      </TypographyStyled>
                      {showCustomJobScopeList ? (
                        <Icon width={20} color={theme.palette.info.main} icon='material-symbols:keyboard-arrow-up-rounded' />
                      ) : (
                        <Icon
                          width={20}
                          color={theme.palette.info.main}
                          icon='material-symbols:keyboard-arrow-down-rounded'
                        />
                      )}
                    </Box>

                    <TypographyStyled
                      onClick={() => setDeleteMode(!deleteMode)}
                      sx={{ position: 'absolute', cursor: 'pointer', top: 20, right: 20, color: theme.palette.info.main }}
                      variant={'body2'}
                    >
                      {deleteMode ? t('Complete') : t('Manage')}
                    </TypographyStyled>

                    <Collapse in={showCustomJobScopeList} timeout='auto' unmountOnExit>
                      {Array.isArray(customJobScopeList) && customJobScopeList.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            gap: 4,
                            mt: 4
                          }}
                        >
                          {customJobScopeList?.map((s: any) => (
                            <Button
                              variant='outlined'
                              sx={theme => ({
                                color: theme.palette.secondary.light,
                                borderRadius: 4,
                                borderColor: theme.palette.secondary.light,
                                py: 1,
                                px: 2.5
                              })}
                              endIcon={deleteMode ? <Icon icon='typcn:delete' /> : undefined}
                              onClick={deleteMode ? () => handleDeletePresetJobScope(s.jobId) : () => handleClickPresetJobScope(s.jobId)}
                            >
                              {s.descn ?? s.jobTitle}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Collapse>
                  </Box>

                  <Dialog
                    open={showJobScopeAddDialog}
                    onClose={handleJobScopeDialogClose}
                    sx={{ ' .MuiDialogContent-root': { paddingTop: 4, mt: 2 } }}
                  >
                    <form noValidate autoComplete='off'>
                      <DialogTitle>{t('添加一个职位范围')}</DialogTitle>
                      <DialogContent
                        sx={{
                          width: '400px',
                          height: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <FormControl fullWidth>
                          <Controller
                            name='customJobScopeTitle'
                            control={controlDialog}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                label={t('职位范围标题')}
                                placeholder={t('职位范围标题') || ''}
                                value={value}
                                onChange={onChange}
                                error={Boolean(errorsDialog.customJobScopeTitle)}
                                aria-describedby='customJobScopeTitle'
                              />
                            )}
                          />
                          {errorsDialog.customJobScopeTitle && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errorsDialog.customJobScopeTitle.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleJobScopeDialogClose}>{t('取消')}</Button>
                        <Button type='button' onClick={handleSubmitDialog(onCustomJobScopeSubmit)}>
                        {t('Adding')}
                        </Button>
                      </DialogActions>
                    </form>
                  </Dialog>
                </Grid>
              </Grid>
            </Grid>
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
