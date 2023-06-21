import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Controller, useForm} from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {styled, useTheme} from "@mui/material/styles";
import * as yup from "yup";
import {Switch, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Alert} from "@mui/lab";
import FormControlLabel from "@mui/material/FormControlLabel";
import CleaveWrapper from "@/@core/styles/libs/react-cleave";
import DatePicker from "react-datepicker";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {TypographyProps} from "@mui/material/Typography";
import { useEffect, useState } from 'react'
import Cleave from "cleave.js/react";
import {common} from "@mui/material/colors";
import {MuiTelInput} from "mui-tel-input";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";

interface DialogFormInputs {
  entiryId: string,
  teamId: string,
  staffName: string,
  staffMobile: string,
  staffEmail: string,
  staffNationality: string,
  staffWorkplaceCountry: string,
  staffWorkplaceState: string,
  staffWorkplaceCity: string,
  staffWorkVisaCode: string,
  staffIDCardNumber: string,
  staffIDCardType: string,
}

interface Iprops{
  handleClose: any
  defaultInfo: any
  organizations: any[]
  teams: any[]
  countries: any[]
  areaList: any[]
  cities: any[]
}
const defaultIdCardTypeList: any[] = [
  {
    id: '1',
    name: '身份证'
  },
  {
    id: '2',
    name: '港澳通行证'
  },
  {
    id: '3',
    name: '台湾通行证'
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

const SalaryForm = ({handleClose, defaultInfo, organizations, teams, countries, areaList, cities}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [addSignBonusChecked, setAddSignBonusChecked] = useState<boolean>(false)
  const [showWorkVisaSelect, setShowWorkVisaSelect] = useState<boolean>(false)
  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })
  const dispatch = useDispatch<AppDispatch>()

  const defaultValues = {
    entiryId: '',
    teamId: '',
    staffName: '',
    staffMobile: '',
    staffEmail: '',
    staffNationality: '',
    staffWorkplaceCountry: '',
    staffWorkplaceState: '',
    staffWorkplaceCity: '',
    staffWorkVisaCode: '',
    staffIDCardNumber: '',
    staffIDCardType: '',
  }


  useEffect(() => {
    console.log(defaultInfo)
      setValue('entiryId', defaultInfo.entiryId)
      setValue('teamId', defaultInfo.teamId)
      setValue('staffName', defaultInfo.staffName)
      setValue('staffMobile',  defaultInfo.staffMobileCountry + ' ' + defaultInfo.staffMobile)
      setValue('staffEmail', defaultInfo.staffEmail)
      setValue('staffNationality', defaultInfo.staffNationality)
      setValue('staffWorkplaceCountry', defaultInfo.staffWorkplaceCountry)
      setValue('staffWorkplaceState', defaultInfo.staffWorkplaceState)
      setValue('staffWorkplaceCity', defaultInfo.staffWorkplaceCity)
      setValue('staffWorkVisaCode', defaultInfo.staffWorkVisaCode)
      setValue('staffIDCardNumber', defaultInfo.staffIDCardNumber)
      setValue('staffIDCardType', defaultInfo.staffIDCardType)
      if (defaultInfo.staffWorkplaceCountry !== defaultInfo.staffNationality){
        setShowWorkVisaSelect(true)
      }
  },[defaultInfo, countries, areaList, cities, teams, organizations])



  const {
    control,
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setShowWorkVisaSelect(getValues('staffNationality') !== getValues('staffWorkplaceCountry'))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const handleSubmit = async() => {
    const arrToTrigger = [
      'entiryId',
      'teamId',
      'staffName',
      'staffMobile',
      'staffEmail',
      'staffNationality',
      'staffWorkplaceCountry',
      'staffWorkplaceState',
      'staffWorkplaceCity',
      'staffWorkVisaCode',
      'staffIDCardNumber',
      'staffIDCardType',
    ]

    // @ts-ignore
    const valid = await trigger(arrToTrigger)
    console.log(valid, errors)
    if (valid) {
      const params = {
        action: 'PREVIEW-SAVE',
        contractId: defaultInfo.contractId,
        orgId: defaultInfo.orgId,
        teamId: '1',
        type: 'EOR',
        jobTitle: {
          entiryId: getValues('entiryId'),
          teamId: getValues('teamId'),
          jobTitle: defaultInfo.jobTitle,
          jobDuty: defaultInfo.jobDuty,
        },
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
          staffWorkVisaCode: getValues('staffWorkVisaCode'),
          staffIDCardNumber: getValues('staffIDCardNumber'),
          staffIDCardType: getValues('staffIDCardType'),
        }
      }
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract(params)
      )
      if (code === 'SUCCESS') {
        await dispatch(getContractDetailById({orgId: '1', contractId: defaultInfo.contractId}));
        handleClose()
      } else if(code === 'INVALID_PARAMETER') {
        toast.error(error, { position: 'top-right' })
      }
    }
    console.log()
  }

  return (
    <Grid item xs={12} sx={{py: 4.5, px: 6}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 6,
        }}
      >
        {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
        <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
          编辑员工信息
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off'>
        <Typography sx={{fontSize: 16, fontWeight: 600, flex: 1, color: '#3A3541DE', mb: 6 }}>
          {t('Job Information')}
        </Typography>
        <Grid container spacing={5} sx={{mb: 8}}>
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
                    aria-describedby='entiryId'
                  >
                    {organizations.map((o: any) => (
                      <MenuItem value={o.entiryId}>{o.entiryName}</MenuItem>
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
                    aria-describedby='contractingTeam'
                  >
                    {teams.map((o: any) => (
                      <MenuItem value={o.teamId}>{o.teamName}</MenuItem>
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
        <Typography sx={{fontSize: 16, fontWeight: 600, flex: 1, color: '#3A3541DE', mb: 6 }}>
          个人信息
        </Typography>
        <Grid item xs={12} sx={{mb: 6}}>
          <FormControl fullWidth>
            <Controller
              name='staffName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('Staff.Employee_name')}
                  placeholder={t('Staff.Employee_name') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.staffName)}
                  aria-describedby='employeeName'
                />
              )}
            />
            {errors.staffName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.staffName.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}  sx={{mb: 6}}>
          <FormControl fullWidth>
            <Controller
              name='staffEmail'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  label={t('Staff.Employee_email')}
                  placeholder={t('Staff.Employee_email') || ''}
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

        <Grid item xs={12}  sx={{mb: 6}} >
          <FormControl fullWidth>
            <InputLabel error={Boolean(errors.staffNationality)} htmlFor='staffNationality'>
              {t('Staff.Employee_nationality')}
            </InputLabel>
            <Controller
              name='staffNationality'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('Staff.Employee_nationality')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.staffNationality)}
                  aria-describedby='staffNationality'
                >
                  {countries.map((country: any) => (
                    <MenuItem value={country.areaCode}>{ country.name }</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.staffNationality && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.staffNationality.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}  sx={{mb: 6}}>
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
                  label={t('Staff.employeeIDCardType')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.staffIDCardType)}
                  aria-describedby='staffIDCardType'
                >
                  {defaultIdCardTypeList.map((v: any) => (
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
        <Grid item xs={12}  sx={{mb: 6}}>
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
        <Grid item xs={12} sx={{mb: 6}}>
          <FormControl fullWidth>
            <InputLabel error={Boolean(errors.staffWorkplaceCountry)} htmlFor='staffWorkplaceCountry'>
              {t('Staff.Employee_work_place')}
            </InputLabel>
            <Controller
              name='staffWorkplaceCountry'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('Staff.Employee_work_place')}
                  value={value}
                  disabled
                  onChange={onChange}
                  error={Boolean(errors.staffWorkplaceCountry)}
                  aria-describedby='employeeWorkPlace'
                >
                  {countries.map((country: any) => (
                    <MenuItem value={country.areaCode}>{ country.name }</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.staffWorkplaceCountry && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.staffWorkplaceCountry.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid container spacing={5} sx={{mb: 6}}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.staffWorkplaceState)} htmlFor='staffWorkplaceState'>
                {t('Staff.Employee_work_state')}
              </InputLabel>
              <Controller
                name='staffWorkplaceState'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Staff.Employee_work_state')}
                    value={value}
                    disabled
                    onChange={onChange}
                    error={Boolean(errors.staffWorkplaceState)}
                    labelId='staffWorkplaceState'
                    aria-describedby='staffWorkplaceState'
                  >
                    {areaList.map((state: any) => (
                      <MenuItem value={state.areaCode}>{state.name}</MenuItem>
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
                {t('工作地城市')}
              </InputLabel>
              <Controller
                name='staffWorkplaceCity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Staff.Employee_work_state')}
                    value={value}
                    onChange={onChange}
                    disabled
                    error={Boolean(errors.staffWorkplaceCity)}
                    labelId='staffWorkplaceCity'
                    aria-describedby='staffWorkplaceCity'
                  >
                    {cities.map((city: any) => (
                      <MenuItem value={city.areaCode}>{city.name}</MenuItem>
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
        {showWorkVisaSelect && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.staffWorkVisaCode)} htmlFor='staffWorkVisaCode'>
                {t('Staff.Employee_work_visa')}
              </InputLabel>
              <Controller
                name='staffWorkVisaCode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Staff.Employee_work_visa')}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.staffWorkVisaCode)}
                    aria-describedby='jobTitle'
                  >
                    <MenuItem value={10}>{t('Staff.Work_visa_gained')}</MenuItem>
                    <MenuItem value={20}>{t('Staff.Work_visa_no_gained')}</MenuItem>
                    <MenuItem value={30}>{t('Staff.Work_visa_platform_resolve')}</MenuItem>
                    <MenuItem value={40}>{t('Staff.Work_visa_no_sure')}</MenuItem>
                  </Select>
                )}
              />
              {errors.staffWorkVisaCode && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.staffWorkVisaCode.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
        <Grid container justifyContent='flex-end'>
          <Button size='large' variant='outlined' onClick={handleClose}>
            {t('取消')}
          </Button>
          <Button size='large' variant='contained' sx={{ ml: 3 }} onClick={() => {handleSubmit()}}>
            {t('继续')}
          </Button>
        </Grid>
      </form>

    </Grid>
  )
}
export default SalaryForm

