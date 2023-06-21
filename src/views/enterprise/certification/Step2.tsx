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
import {SAVE_ENTITY_LEGAL_PERSON} from "@/apis";
import {useTheme} from "@mui/material/styles";

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  setShowDialog: Dispatch<SetStateAction<boolean>>
  entityId: string
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

interface FormInputs {
  orgId: string,
  bizEntityId: string,
  certificateType: string,
  name: string,
  idNumber: string,
  startDate: any,
  endDate: any,
  isPermanent: string,
}

const defaultIdCardTypeList: any[] = [
  {
    id: '1',
    name: '大陆身份证',
  },
  {
    id: '5',
    name: '护照'
  },
  {
    id: '3',
    name: '港澳居民通行证',

  },
  {
    id: '4',
    name: '台湾居民通行证'
  },
]

const cardTypeUrlMap: any = {
  '1': {
    url1: '/ocr/idcard-front',
    url2: '/ocr/idcard-back',
  },
  '3': {
    url1: '/ocr/hk-mc-idcard-front',
  },
  '4': {
    url1: '/ocr/tw-idcard-front',
  },
  '5': {
    url1: '/ocr/passport',
  },
}
const cardTypeTipsMap: any = {
  '1': {
    tips1: '上传人像面',
    tips2: '上传国徽面',
  },
  '3': {
    tips1: '上传人像面',
  },
  '4': {
    tips1: '上传人像面',
  },
  '5': {
    tips1: '上传护照',
  },
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const Step1 = ({entityId, setShowDialog, setStep }: Props) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [legalPersonInfo, setLegalPersonInfo] = useState<any>({})
  const [cardType, setCardType] = useState<any>('1')
  const [previewImg1, setPreviewImg1] = useState<string>('')
  const [previewImg2, setPreviewImg2] = useState<string>('')
  const [uploadFinish1, setUploadFinish1] = useState<boolean>(false)
  const [uploadFinish2, setUploadFinish2] = useState<boolean>(false)
  const [permanent, setPermanent] = useState<string | number>('')
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const defaultValues = {
    orgId: '',
    bizEntityId: '',
    certificateType: '1',
    name: '',
    idNumber: '',
    startDate: '',
    endDate: '',
    isPermanent: '',
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = async () => {
    const validateArr = [
      'certificateType',
      'name',
      'idNumber',
      'startDate',
      'endDate',
      'isPermanent',
    ]

    // @ts-ignore
    const valid = await trigger(validateArr)
    if(valid) {
      const params = {
        orgId: '1',
        bizEntityId: entityId,
        certificateType: getValues('certificateType'),
        name: getValues('name'),
        idNumber: getValues('idNumber'),
        startTime: new Date(getValues('startDate')).getTime(),
        endTime: new Date(getValues('endDate')).getTime(),
        isPermanent: getValues('isPermanent') || '0'
      }
      console.log(params)
      axios.post(SAVE_ENTITY_LEGAL_PERSON, params).then(res => {
        if(res.data.code === 'SUCCESS') {
          setShowDialog(true)
        }
      })
    }
  }



  useEffect(() => {
    console.log(files)
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles: File[]) => {
      imgToBase64AndUpLoad(acceptedFiles[0], 1)
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: (e) => {
      console.log(e)
      toast.error(t('只允许上传一个文件') as string, {
        duration: 2000
      })
    }
  })

  const Dropzone2 = useDropzone({
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles: File[]) => {
      imgToBase64AndUpLoad(acceptedFiles[0], 2)
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error(t('只允许上传一个文件') as string, {
        duration: 2000
      })
    }
  })



  const imgToBase64AndUpLoad = (file: any, type: number) => {
    const reader = new FileReader();
    let imgUrlBase64;
    if (file) {
      //将文件以Data URL形式读入页面
      imgUrlBase64 = reader.readAsDataURL(file);
      reader.onload = function (e) {
        //var ImgFileSize = reader.result.subst
        // ring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
        if(type === 1) {
          setPreviewImg1(String(reader.result))
          setUploadFinish1(true)
          axios.post(cardTypeUrlMap[cardType].url1, {base64Img: encodeURIComponent(String(reader.result))}).then(res => {
            setUploadFinish1(false)
            if(res.data.code === 'SUCCESS') {
              const result = res.data.data
              setLegalPersonInfo({
                ...legalPersonInfo,
                ...res.data.data
              })
              setValue('idNumber', result.id)
              setValue('name', result.name)
              if(cardType !== '1') {
                setValue('startDate', new Date(result.startDate|| new Date()))
                setValue('endDate', new Date(result.endDate|| new Date()))
                if(result.permanent || result.permanent === '0') {
                  setPermanent(String(result.permanent))
                }
              }
            }
          }).catch(() => {
            setUploadFinish1(false)
          })
        } else if(type === 2) {
          setPreviewImg2(String(reader.result))
          setUploadFinish2(true)
          axios.post(cardTypeUrlMap[cardType].url2, {base64Img: encodeURIComponent(String(reader.result))}).then(res => {
            setUploadFinish2(false)
            if(res.data.code === 'SUCCESS') {
              const result = res.data.data
              setLegalPersonInfo({
                ...legalPersonInfo,
                ...res.data.data
              })
              if(cardType === '1') {
                setValue('startDate', new Date(result.startDate || new Date()))
                setValue('endDate', new Date(result.endDate || new Date()))
                if(result.permanent || result.permanent === '0') {
                  setPermanent(String(result.permanent))
                }
              }
            }
          }).catch(() => {
            setUploadFinish2(false)
          })
        }
      }
    }
  }
  const handleChangeBusinessTerm = (e: any, val: boolean) => {
    if(val) {
      setPermanent('1')
    }else {
      setPermanent('0')
    }
  }

  const deletePreviewImg1 = () => {
    setPreviewImg1('')
    setLegalPersonInfo({})
  }
  const deletePreviewImg2 = () => {
    setPreviewImg2('')
  }

  return (
    <Box>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*<Alert severity='error'>*/}
          {/*  <AlertTitle>{t('完善您的企业档案，开启更多跨境业务拓展的可能性。')}</AlertTitle>*/}
          {/*  {t('请放心，我们将根据法律规定，对您的信息进行严格保密，并谨慎遵守隐私条款')}*/}
          {/*</Alert>*/}

          <Card sx={{ my: 5 }}>
            <Button  onClick={() => {setStep(prev => prev - 1)}}>返回</Button>
            <CardHeader title={t('法人信息')} />
            <CardContent>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='certificateType' error={Boolean(errors.certificateType)} htmlFor='certificateType'>
                    {t('Document type')}
                  </InputLabel>
                  <Controller
                    name='certificateType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label={t('Document type')}
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value)
                          setCardType(e.target.value)
                        }}
                        error={Boolean(errors.certificateType)}
                        labelId='certificateType'
                        aria-describedby='certificateType'
                      >
                        {
                          defaultIdCardTypeList.map((v: any) => (
                            <MenuItem value={v.id}>{t(v.name)}</MenuItem>
                          ))
                        }
                      </Select>
                    )}
                  />
                  {errors.certificateType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                      {t('This field is required')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </CardContent>
            <Grid item xs={12} sx={{backgroundColor: '#fff', color: '#7C4DFF', py: 2, mb: 5}} textAlign='center'>
              <Grid
                item
                sx={{
                  mx: 6,
                  borderRadius: 1,
                  minHeight: 172,
                  backgroundColor: '#F9FAFC',
                  border: '1px dashed #7C4DFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                {
                  previewImg1 ? (
                    uploadFinish1 ? <Icon icon="eos-icons:bubble-loading" width={50} height={50} /> : <Box component="img" src={previewImg1} width={200} onClick={() => {deletePreviewImg1()}} />
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
                        {cardTypeTipsMap[cardType].tips1}
                      </Typography>
                    </div>
                  )
                }
              </Grid>
            </Grid>
            {
              cardType === '1' && (
                <Grid item xs={12} sx={{backgroundColor: '#fff', color: '#7C4DFF', py: 2, mb: 5}} textAlign='center'>
                  <Grid
                    item
                    sx={{
                      mx: 6,
                      borderRadius: 1,
                      minHeight: 172,
                      backgroundColor: '#F9FAFC',
                      border: '1px dashed #7C4DFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    {
                      previewImg2 ? (
                        uploadFinish2 ? <Icon icon="eos-icons:bubble-loading" width={50} height={50} /> : <Box component="img" src={previewImg2} width={200} onClick={() => {deletePreviewImg2()}} />
                      ) : (
                        <div
                          {...Dropzone2.getRootProps({ className: 'dropzone' })}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          <input {...Dropzone2.getInputProps()} />
                          <Icon icon="material-symbols:upload" style={{fontSize: 32, color: '#3A354161'}} />
                          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', mt: 3}}>
                            {cardTypeTipsMap[cardType].tips2}
                          </Typography>
                        </div>
                      )
                    }
                  </Grid>
                </Grid>
              )
            }

            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', pl: 5, mb: 2}}>
              1.  上传小于5MB的文件，支持 jpg  png  gif  jpeg 格式的图片
            </Typography>
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', pl: 5, mb: 6}}>
              2. 请上传清晰营业执照图片，系统识别公司信息自动进行填写，营业执照复印件需加盖公司红章扫描上传
            </Typography>
          </Card>
          {
            legalPersonInfo.name &&
            <Card sx={{my: 5}}>
              <CardContent>
                <Grid container sx={{px: 4}}>
                  <Grid item xs={12}>
                    <Typography sx={{fontSize: 14, fontWeight: 500, color: '#FFB400'}}>
                      请核对信息，如有错误请进行修改：
                    </Typography>
                    <CardHeader sx={{px: 0, py: 6}} title={t('法人信息')} />
                  </Grid>
                  <Grid item xs={12} sx={{mb: 8}}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('法人姓名')}
                            placeholder={t('法人姓名') || ''}
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.name)}
                            aria-describedby='name'
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }} id='name'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{mb: 8}}>
                    <FormControl fullWidth>
                      <Controller
                        name='idNumber'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            label={t('法人证件号')}
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
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} sx={{mb: 6,display: 'flex', alignItems: 'center'}}>
                    <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE', mr: 6}}>
                      法人证件有效期
                    </Typography>
                    <Checkbox checked={permanent === '1'} onChange={handleChangeBusinessTerm} />
                    <Typography sx={{fontSize: 16, fontWeight: 400, color: '#3A354199', ml: 3}}>
                      长期有效
                    </Typography>
                  </Grid>
                  <Grid container md={12}>
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
                          rules={{ required: getValues('isPermanent') === '0' }}
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
                </Grid>
              </CardContent>
            </Card>
          }
          <Grid item xs={12}>
            <Button size='large' type='submit' variant='contained' sx={{ width: '100%' }}>
              {t('确认提交')}
            </Button>
          </Grid>
        </form>
      </DatePickerWrapper>
    </Box>
  )
}

export default Step1
