// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import {ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
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
import { useForm, Controller } from 'react-hook-form'
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import Typography from '@mui/material/Typography'
import FileUploader from '../../contract/part-time/components/part-time-components/components/FileUploader'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import {useDropzone} from "react-dropzone";
import toast from "react-hot-toast";
import Icon from '@/@core/components/icon'
import Checkbox from '@mui/material/Checkbox'
import axios from "axios";
import {GET_COUNTRY_LIST, UPLOAD_BUSINESS_LICENSE, SAVE_ENTITY, GET_LOCALE_COUNTRY} from "@/apis";
import {useTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  setEntityId: Dispatch<SetStateAction<string>>
  handleChangePlace: any
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

interface FormInputs {
  entityName: string,
  creditCode: string,
  province: string,
  city: string,
  detailAddress: string,
  establishedDate: any,
  permanent: string,
  startDate: any,
  endDate: any,
  capital: string,
  businessScope: string,
  entiryCountry: string,
  type: string,
  registrationTaxNumber: string,
  idNumber: string
}

const businessType: {id: string, name: string}[] = [
  {
    id: '1',
    name: '企业'
  },
   {
    id: '2',
    name: '个体经营者'
  },
   {
    id: '3',
    name: '其他'
  },

]

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const Step1 = ({ setStep, setEntityId,handleChangePlace }: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [files, setFiles] = useState<File[]>([])
  const [countires, setCountires] = useState<any[]>([])
  const [entityInfo, setEntityInfo] = useState<any>({})
  const [previewImg, setPreviewImg] = useState<string>('')
  const [permanent, setPermanent] = useState<string>('')
  const [provinceList, setProvinceList] = useState<any[]>([])
  const [cityList, setCityList] = useState<any[]>([])
  const [entiryCountry, setEntiryCountry] = useState<string>('')
  const [uploadFinish, setUploadFinish] = useState<boolean>(false)
  const { orgId } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    getCountryList()
    getProvinceList()
  }, [])

  useEffect(() => {
    console.log(entiryCountry)
  }, [entiryCountry])

  const defaultValues = {
    entityName: '',
    creditCode: '',
    province: '',
    city: '',
    detailAddress: '',
    establishedDate: new Date(),
    permanent: '',
    startTime: '',
    endTime: '',
    capital: '',
    businessScope: '',
    entiryCountry: '',
    startDate: '',
    endDate: '',
    type: '',
    registrationTaxNumber: '',
    idNumber: ''
  }


  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = async () => {
    const validateArr: string[] =  [
      'entityName',
      'creditCode',
      'province',
      'city',
      'detailAddress',
      'establishedDate',
      'permanent',
      'capital',
      'entiryCountry',
      'startDate',
      'endDate',
      'permanent'
    ]

    // @ts-ignore
    const valid = await trigger(validateArr);
    if(valid) {
      const params = {
        orgId: orgId,
        entiryName: getValues('entityName'),
        entiryCountry: getValues('entiryCountry'),
        province: getValues('province'),
        city: getValues('city'),
        detailAddress: getValues('detailAddress'),
        creditCode: getValues('creditCode'),
        capital: getValues('capital'),
        establishedDate: new Date(getValues('establishedDate')).getTime(),
        permanent: getValues('permanent'),
        businessScope: getValues('businessScope'),
        endDate: new Date(getValues('endDate')).getTime(),
        kycStatus: 3
      }
      console.log(params)
      axios.post(SAVE_ENTITY, params).then(res => {
        setEntityId(String(res.data.data))
        setStep(prev => prev + 1)
        console.log(res)
      })
    }
  }

  const getCountryList = () => {
    axios.get(GET_LOCALE_COUNTRY, {params:
        {
          parent:'0',
          action:'WORK-COUNTRY'
        }
    }).then(res => {
     if(res.data.code === 'SUCCESS') {
       setCountires(res.data.data)
     }
   });
  }

  const getProvinceList = () => {
    axios.get(GET_LOCALE_COUNTRY, {params: {parent: 'CN'}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        setProvinceList(res.data.data)
      }
    })
  }

  const getCityList = (parent: string, defaultValue?: string) => {
    axios.get(GET_LOCALE_COUNTRY, {params: {parent}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        setCityList(res.data.data)
        if(defaultValue) {
          const tempCity = res.data.data.find((v: any) => v.name === defaultValue)?.areaCode
          if (tempCity) {
            setValue('city', tempCity);
          }
        }
      }
    })
  }



  useEffect(() => {
    console.log(files)
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles: File[]) => {
      imgToBase64AndUpLoad(acceptedFiles[0])
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error(t('只允许上传一个文件') as string, {
        duration: 2000
      })
    }
  })

  const deleteImage = () => {
    setEntityInfo({})
    setPreviewImg('')
  }



  const imgToBase64AndUpLoad = (file: any) => {
    const reader = new FileReader();
    let imgUrlBase64;
    if (file) {
      //将文件以Data URL形式读入页面
      imgUrlBase64 = reader.readAsDataURL(file);
      reader.onload = function (e) {
        //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
        setPreviewImg(String(reader.result))
        setUploadFinish(true)
        axios.post(UPLOAD_BUSINESS_LICENSE, {base64Img: encodeURIComponent(String(reader.result))}).then(async (res) => {
          setUploadFinish(false)
          if(res.data.code === 'SUCCESS') {
            const result = res.data.data
            setValue('entityName', result.entityName)
            setValue('creditCode', result.creditCode)
            setValue('province', result.province)
            setValue('city', result.city)
            setValue('detailAddress', result.detailAddress)
            setValue('establishedDate', new Date(result.establishedDate))
            setValue('startDate', result.startDate || '')
            setValue('endDate', result.endDate || '')
            setValue('capital', result.capital)
            setValue('businessScope', result.businessScope)
            setValue('permanent', result.permanent ? String(result.permanent) : '0')
            setPermanent(result.permanent ? String(result.permanent) : '0')
            if(result.province) {
              const tempProvince = provinceList.find((v:any) => v.name === (result.province.replace('省', '')))?.areaCode
              setValue('province', tempProvince)
              await getCityList(tempProvince, result.city)
            }
            setEntityInfo(res.data.data)
          }
        }).catch(() => {
          setUploadFinish(false)
        })
      }
    }
  }
  const handleChangeBusinessTerm = (e: any, val: boolean) => {
    if(val) {
      setPermanent('1')
      setValue('permanent', '1')
    }else {
      setPermanent('0')
      setValue('permanent', '0')
    }
  }

  const sgCountryForm = () => {
    return (
      <Grid item xs={12} sx={{px: 6}}>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='entityName'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('企业法定名称')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.entityName)}
                  aria-describedby='entityName'
                />
              )}
            />
            {errors.entityName && (
              <FormHelperText sx={{ color: 'error.main' }} id='entityName'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <InputLabel id='type' error={Boolean(errors.province)} htmlFor='type'>
              {t('企业类型')}
            </InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('企业类型')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.type)}
                  labelId='type'
                  aria-describedby='type'
                >
                  {
                    businessType.map((v: any) => (
                      <MenuItem value={v.id}>{t(v.name)}</MenuItem>
                    ))
                  }
                </Select>
              )}
            />
            {errors.type && (
              <FormHelperText sx={{ color: 'error.main' }} id='type'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='registrationTaxNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('GST Reg No.')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.registrationTaxNumber)}
                  aria-describedby='registrationTaxNumber'
                />
              )}
            />
            {errors.registrationTaxNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='registrationTaxNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0',mt: 1}}>
              请输入增值税，消费与服务税注册号
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='idNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('UEN')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.idNumber)}
                  aria-describedby='idNumber'
                />
              )}
            />
            {errors.idNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='idNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0', mt: 1}}>
              请输入增值税，消费与服务税注册号
            </Typography>
          </FormControl>
        </Grid>
      </Grid>
    )
  }
  const jpCountryForm = () => {
    return (
      <Grid item xs={12} sx={{px: 6}}>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='entityName'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('企业法定名称')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.entityName)}
                  aria-describedby='entityName'
                />
              )}
            />
            {errors.entityName && (
              <FormHelperText sx={{ color: 'error.main' }} id='entityName'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <InputLabel id='type' error={Boolean(errors.province)} htmlFor='type'>
              {t('企业类型')}
            </InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('企业类型')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.type)}
                  labelId='type'
                  aria-describedby='type'
                >
                  {
                    businessType.map((v: any) => (
                      <MenuItem value={v.id}>{t(v.name)}</MenuItem>
                    ))
                  }
                </Select>
              )}
            />
            {errors.type && (
              <FormHelperText sx={{ color: 'error.main' }} id='type'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='registrationTaxNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('纳税人识别号 Tax ID')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.registrationTaxNumber)}
                  aria-describedby='registrationTaxNumber'
                />
              )}
            />
            {errors.registrationTaxNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='registrationTaxNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0',mt: 1}}>
              请输入12位数字的纳税人识别号
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='idNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('合作伙伴编号')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.idNumber)}
                  aria-describedby='idNumber'
                />
              )}
            />
            {errors.idNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='idNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0', mt: 1}}>
              请输入增值税，消费与服务税注册号
            </Typography>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  const twCountryForm = () => {
    return (
      <Grid item xs={12} sx={{px: 6}}>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='entityName'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('企业法定名称')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.entityName)}
                  aria-describedby='entityName'
                />
              )}
            />
            {errors.entityName && (
              <FormHelperText sx={{ color: 'error.main' }} id='entityName'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <InputLabel id='type' error={Boolean(errors.province)} htmlFor='type'>
              {t('企业类型')}
            </InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('企业类型')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.type)}
                  labelId='type'
                  aria-describedby='type'
                >
                  {
                    businessType.map((v: any) => (
                      <MenuItem value={v.id}>{t(v.name)}</MenuItem>
                    ))
                  }
                </Select>
              )}
            />
            {errors.type && (
              <FormHelperText sx={{ color: 'error.main' }} id='type'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='registrationTaxNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('纳税人识别号 Tax ID')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.registrationTaxNumber)}
                  aria-describedby='registrationTaxNumber'
                />
              )}
            />
            {errors.registrationTaxNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='registrationTaxNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0',mt: 1}}>
              纳税人识别号由15位、17位、18或者20位码（字符型）组成
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{mb: 4}}>
          <FormControl fullWidth>
            <Controller
              name='idNumber'
              control={control}
              rules={{ required: getValues('entiryCountry') === 'SG' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('营利事业统一编号（台湾）')}
                  placeholder={t('请输入') || ''}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.idNumber)}
                  aria-describedby='idNumber'
                />
              )}
            />
            {errors.idNumber && (
              <FormHelperText sx={{ color: 'error.main' }} id='idNumber'>
                {t('This field is required')}
              </FormHelperText>
            )}
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#139CE0', mt: 1}}>
              请输入8位数字的营利事业统一编号
            </Typography>
          </FormControl>
        </Grid>
      </Grid>
    )
  }


  return (
    <Box>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Alert severity='info'>
            <AlertTitle>{t('完善您的企业档案，开启更多跨境业务拓展的可能性。')}</AlertTitle>
            {t('请放心，我们将根据法律规定，对您的信息进行严格保密，并谨慎遵守隐私条款')}
          </Alert>

          <Card sx={{ my: 5 }}>
            <CardHeader title={t('基础信息')} />
            <CardContent>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='entiryCountry' error={Boolean(errors.entiryCountry)} htmlFor='entiryCountry'>
                    {t('企业注册的国家/地区')}
                  </InputLabel>
                  <Controller
                    name='entiryCountry'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('企业注册的国家/地区')}
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value)
                          setEntiryCountry(e.target.value)
                          handleChangePlace(e.target.value)
                        }}
                        error={Boolean(errors.entiryCountry)}
                        labelId='registerContryLabel'
                        aria-describedby='registerContry'
                      >
                        {
                          countires.map((v: any) => (
                            <MenuItem value={v.areaCode}>{t(v.name)}</MenuItem>
                          ))
                        }
                      </Select>
                    )}
                  />
                  {errors.entiryCountry && (
                    <FormHelperText sx={{ color: 'error.main' }} id='registerContry'>
                      {t('This field is required')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </CardContent>
            {
              entiryCountry === 'CN' && (
                <>
                  <CardHeader sx={{pb: 2}} title={t('请上传：营业执照图片')} />
                  <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', pl: 5, mb: 5}}>执照类型：多证合一营业执照（统一社会信用代码）</Typography>
                  <Grid item xs={12} sx={{backgroundColor: '#fff', color: '#7C4DFF', py: 2, mb: 5}} textAlign='center'>
                    <Grid
                      item
                      sx={{
                        mx: 6,
                        borderRadius: 1,
                        height: 172,
                        backgroundColor: '#F9FAFC',
                        border: '1px dashed #7C4DFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      {
                        previewImg ? (
                          !uploadFinish ?  <Box component="img" src={previewImg} width={200} onClick={() => {deleteImage()}} />  : <Icon icon="eos-icons:bubble-loading" width={50} height={50} />

                        ) : (
                          <div
                            {...getRootProps({ className: 'dropzone' })}
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                            <input {...getInputProps()} />
                            <Icon icon="material-symbols:upload" style={{fontSize: 32, color: '#3A354161'}} />
                            <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', mt: 3}}>
                              拖拽文件到这里，或者点击上传
                            </Typography>
                          </div>
                        )
                      }
                    </Grid>
                  </Grid>
                  <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', pl: 5, mb: 2}}>
                    1.  上传小于5MB的文件，支持 jpg  png  gif  jpeg 格式的图片
                  </Typography>
                  <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', pl: 5, mb: 6}}>
                    2. 请上传清晰营业执照图片，系统识别公司信息自动进行填写，营业执照复印件需加盖公司红章扫描上传
                  </Typography>
                </>
              )
            }
            {
              entiryCountry === 'SG' && sgCountryForm()
            }
            {
              entiryCountry === 'JP' && jpCountryForm()
            }
            {
              entiryCountry === 'TW' && twCountryForm()
            }
          </Card>
          {
            (entityInfo.entityName && previewImg) &&
            <Card sx={{my: 5}}>
              <CardContent>
                <Grid container sx={{px: 4}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#FFB400', mb: 6}}>
                    请核对信息，如有错误请进行修改，以下信息请跟营业执照上的信息一致：
                  </Typography>
                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='entityName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('公司名称')}
                            placeholder={t('公司名称') || ''}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.entityName)}
                            aria-describedby='enterpriseName'
                          />
                        )}
                      />
                      {errors.entityName && (
                        <FormHelperText sx={{ color: 'error.main' }} id='enterpriseName'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', mb: 6}}>
                      请按照营业执照上登记的完整名称填写，如有（），请在输入法为中文状态下输入
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='creditCode'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('统一社会信用代码')}
                            placeholder={t('请输入') || ''}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.creditCode)}
                            aria-describedby='enterpriseNameEn'
                          />
                        )}
                      />
                      {errors.creditCode && (
                        <FormHelperText sx={{ color: 'error.main' }} id='enterpriseNameEn'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid container md={12} sx={{mb: 4}}>
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <InputLabel id='province' error={Boolean(errors.province)} htmlFor='province'>
                          {t('注册地省份')}
                        </InputLabel>
                        <Controller
                          name='province'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label={t('注册地省份')}
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value);
                                getCityList(e.target.value)
                                setValue('city', '')
                              }}
                              error={Boolean(errors.province)}
                              labelId='province'
                              aria-describedby='province'
                            >
                              {
                                provinceList.map((v: any) => (
                                  <MenuItem value={v.areaCode}>{t(v.name)}</MenuItem>
                                ))
                              }
                            </Select>
                          )}
                        />
                        {errors.province && (
                          <FormHelperText sx={{ color: 'error.main' }} id='province'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.4} />
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <InputLabel id='city' error={Boolean(errors.city)} htmlFor='city'>
                          {t('注册地城市')}
                        </InputLabel>
                        <Controller
                          name='city'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label={t('注册地城市')}
                              value={value}
                              onChange={onChange}
                              error={Boolean(errors.city)}
                              labelId='city'
                              aria-describedby='city'
                            >
                              {
                                cityList.map((v: any) => (
                                  <MenuItem value={v.areaCode}>{t(v.name)}</MenuItem>
                                ))
                              }
                            </Select>
                          )}
                        />
                        {errors.city && (
                          <FormHelperText sx={{ color: 'error.main' }} id='city'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='detailAddress'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('注册地址')}
                            placeholder={t('请输入') || ''}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.detailAddress)}
                            aria-describedby='detailAddress'
                          />
                        )}
                      />
                      {errors.detailAddress && (
                        <FormHelperText sx={{ color: 'error.main' }} id='detailAddress'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='establishedDate'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            selected={value}
                            popperPlacement={popperPlacement}
                            onChange={e => onChange(e)}
                            placeholderText='MM/DD/YYYY'
                            customInput={
                              <CustomInput
                                value={value}
                                onChange={onChange}
                                label={t('成立日期')}
                                error={Boolean(errors.establishedDate)}
                                aria-describedby='registerDate'
                              />
                            }
                          />
                        )}
                      />
                      {errors.establishedDate && (
                        <FormHelperText sx={{ color: 'error.main' }} id='registerDate'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{mb: 6,display: 'flex', alignItems: 'center'}}>
                    <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE', mr: 6}}>
                      营业期限
                    </Typography>
                    <Checkbox checked={permanent === '1'} onChange={handleChangeBusinessTerm} />
                    <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A354199', ml: 3}}>
                      长期有效
                    </Typography>
                  </Grid>
                  <Grid container md={12} sx={{mb: 4}}>
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <Controller
                          name='startDate'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <DatePicker
                              selected={value}
                              popperPlacement={popperPlacement}
                              onChange={e => onChange(e)}
                              placeholderText='MM/DD/YYYY'
                              customInput={
                                <CustomInput
                                  value={value}
                                  onChange={onChange}
                                  label={t('开始日期')}
                                  error={Boolean(errors.startDate)}
                                  aria-describedby='startDate'
                                />
                              }
                            />
                          )}
                        />
                        {errors.startDate && (
                          <FormHelperText sx={{ color: 'error.main' }} id='startDate'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.4} />
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <Controller
                          name='endDate'
                          control={control}
                          rules={{ required: permanent === '0' }}
                          render={({ field: { value, onChange } }) => (
                            <DatePicker
                              selected={value}
                              popperPlacement={popperPlacement}
                              onChange={e => onChange(e)}
                              placeholderText='MM/DD/YYYY'
                              disabled={permanent === '1'}
                              customInput={
                                <CustomInput
                                  value={value}
                                  onChange={onChange}
                                  label={t('结束日期')}
                                  error={Boolean(errors.endDate)}
                                  aria-describedby='endDate'
                                />
                              }
                            />
                          )}
                        />
                        {errors.endDate && (
                          <FormHelperText sx={{ color: 'error.main' }} id='endDate'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='capital'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('注册资本')}
                            placeholder={t('请输入') || ''}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.detailAddress)}
                            aria-describedby='detailAddress'
                          />
                        )}
                      />
                      {errors.detailAddress && (
                        <FormHelperText sx={{ color: 'error.main' }} id='detailAddress'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{mb: 4}}>
                    <FormControl fullWidth>
                      <Controller
                        name='businessScope'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            rows={4}
                            multiline
                            {...field}
                            label={t('经营范围')}
                            error={Boolean(errors.businessScope)}
                            aria-describedby='businessScope'
                          />
                        )}
                      />
                      {errors.businessScope && (
                        <FormHelperText sx={{ color: 'error.main' }} id='businessScope'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          }
          <Grid item xs={12}>
            <Button size='large' type='submit' variant='contained' sx={{ width: '100%' }}>
              {t('Next step')}
            </Button>
          </Grid>
        </form>
      </DatePickerWrapper>
    </Box>
  )
}

export default Step1
